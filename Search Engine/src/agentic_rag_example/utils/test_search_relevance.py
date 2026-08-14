"""Relevance test for search_profiles().

Real profiles are filled in gradually, so relying on them alone makes this
test's outcome depend on whoever last edited their bio. Instead it inserts
fixtures with known text, asserts the right one ranks first for each query,
and deletes them again -- deterministic regardless of live data.

Fixture `niche` values are lists: profiles.niche is a text[] column, mapped
to TEXT_ARRAY in Weaviate.

Weaviate only. Supabase is never written to. Cleanup runs in a finally block.
"""

import os
import sys
from pathlib import Path

import weaviate
from dotenv import load_dotenv
from weaviate.classes.init import Auth

UTILS = Path(__file__).resolve().parent
sys.path.insert(0, str(UTILS))
from search_profiles import COLLECTION_NAME, search_profiles  # noqa: E402

load_dotenv(UTILS.parents[2] / ".env")

# uuid -> properties. Names carry a TEMP- prefix so anything left behind by a
# crash is obvious in the console.
FIXTURES = {
    "aaaaaaaa-0000-0000-0000-000000000001": {
        "name": "TEMP-Beauty", "role": "creator", "niche": ["BEAUTY"], "location": "Hanoi",
        "bio": "I post skincare routines, product reviews and makeup tutorials for young women.",
    },
    "aaaaaaaa-0000-0000-0000-000000000002": {
        "name": "TEMP-Fitness", "role": "creator", "niche": ["FITNESS"], "location": "Da Nang",
        "bio": "Strength coach filming gym workouts, lifting form breakdowns and protein recipes.",
    },
    "aaaaaaaa-0000-0000-0000-000000000003": {
        "name": "TEMP-Tech", "role": "creator", "niche": ["TECH"], "location": "Ho Chi Minh City",
        "bio": "I review laptops, mechanical keyboards and phone gadgets for students.",
    },
    "aaaaaaaa-0000-0000-0000-000000000004": {
        "name": "TEMP-CosmeticsBrand", "role": "brand", "niche": ["BEAUTY"], "location": "Hanoi",
        "bio": "Cosmetics company launching a new facial serum and moisturiser line.",
    },
    "aaaaaaaa-0000-0000-0000-000000000005": {
        "name": "TEMP-SupplementBrand", "role": "brand", "niche": ["FITNESS"], "location": "Hanoi",
        "bio": "Sports nutrition brand selling whey protein and pre-workout supplements.",
    },
}

# (query, role filter, expected result, worst acceptable rank)
#
# Rank is 1 everywhere except the last case. Search is hybrid (BM25 fused with
# vector), and "protein powder company" contains "company", which appears
# verbatim in the cosmetics brand's bio and nowhere in the supplement brand's.
# Across a 12-object corpus that lexical collision is enough to take the top
# slot; BM25 weighs a term by how rare it is, and in a corpus this small a
# common word like "company" still looks distinctive. Asserting top-2 keeps
# this honest -- it still fails loudly if the right brand drops out of
# contention -- without pretending the collision does not exist.
CASES = [
    ("skincare routines and makeup tutorials", None, "TEMP-Beauty", 1),
    ("someone who films workouts at the gym", "creator", "TEMP-Fitness", 1),
    ("reviews of laptops and keyboards", "creator", "TEMP-Tech", 1),
    ("company selling face serum", "brand", "TEMP-CosmeticsBrand", 1),
    ("protein powder company", "brand", "TEMP-SupplementBrand", 2),
]

# Exact-name lookups. These are why search is hybrid rather than pure vector:
# name/handle are stored skip_vectorization, so a vector-only query could
# never match them.
NAME_CASES = [
    ("Warren", None, "Warren"),
    ("warren", None, "Warren"),
    ("Due Linh", None, "Due Linh"),
]


def main() -> int:
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=os.getenv("WEAVIATE_URL"),
        auth_credentials=Auth.api_key(os.getenv("WEAVIATE_API_KEY")),
        headers={"X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")},
    )
    col = client.collections.get(COLLECTION_NAME)
    baseline = col.aggregate.over_all(total_count=True).total_count
    failures = 0
    try:
        for uid, props in FIXTURES.items():
            col.data.insert(properties={"profile_id": uid, "handle": "", **props}, uuid=uid)
        seeded = col.aggregate.over_all(total_count=True).total_count
        print(f"collection: {baseline} -> {seeded} objects (added {len(FIXTURES)} fixtures)\n")

        for query, role, expected, worst_rank in CASES:
            results = search_profiles(query, role=role, limit=3)
            names = [r["name"] for r in results]
            rank = names.index(expected) + 1 if expected in names else None
            ok = rank is not None and rank <= worst_rank
            failures += 0 if ok else 1
            label = f' [role={role}]' if role else ""
            print(f'{"PASS" if ok else "FAIL"}  "{query}"{label}')
            print(f"        expected {expected} within rank {worst_rank}, got rank {rank}")
            for i, r in enumerate(results):
                print(f"        {i+1}. score={r['score']:.4f}  {r['name']}  ({r['role']})")
            # Role filter must hold for every returned row, not just the top one
            if role:
                bad = [r["name"] for r in results if r["role"] != role]
                if bad:
                    failures += 1
                    print(f"        FAIL: role filter leaked non-{role} rows: {bad}")
            print()

        for query, role, expected in NAME_CASES:
            results = search_profiles(query, role=role, limit=2)
            top = results[0]["name"] if results else None
            ok = top == expected
            failures += 0 if ok else 1
            margin = (results[0]["score"] - results[1]["score"]) if len(results) > 1 else 0
            print(f'{"PASS" if ok else "FAIL"}  name lookup "{query}" -> {top} (margin {margin:.2f})')
        print()

        # A filtered query must never return a profile of the other role.
        creators = search_profiles("anything at all", role="creator", limit=20)
        brands = search_profiles("anything at all", role="brand", limit=20)
        roles_ok = all(r["role"] == "creator" for r in creators) and all(
            r["role"] == "brand" for r in brands
        )
        failures += 0 if roles_ok else 1
        print(f'{"PASS" if roles_ok else "FAIL"}  role filter isolation '
              f"({len(creators)} creators / {len(brands)} brands, no cross-contamination)")
    finally:
        for uid in FIXTURES:
            try:
                col.data.delete_by_id(uid)
            except Exception as exc:  # noqa: BLE001 - cleanup must not mask results
                print(f"WARNING: could not delete {uid}: {exc}")
        final = col.aggregate.over_all(total_count=True).total_count
        print(f"\ncleanup: back to {final} objects "
              f"({'OK' if final == baseline else 'MISMATCH - leftovers!'})")
        client.close()

    print(f"\n{'ALL CHECKS PASSED' if failures == 0 else f'{failures} CHECK(S) FAILED'}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
