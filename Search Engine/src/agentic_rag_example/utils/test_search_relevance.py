"""Relevance test for search_profiles().

The 7 real profiles all have empty bio/niche/location, so querying them can
only ever prove "it ran" -- every distance comes back identical. To actually
test ranking, this inserts temporary profiles that DO have text, asserts the
right one ranks first for each query, then deletes them.

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
        "name": "TEMP-Beauty", "role": "creator", "niche": "Beauty", "location": "Hanoi",
        "bio": "I post skincare routines, product reviews and makeup tutorials for young women.",
    },
    "aaaaaaaa-0000-0000-0000-000000000002": {
        "name": "TEMP-Fitness", "role": "creator", "niche": "Fitness", "location": "Da Nang",
        "bio": "Strength coach filming gym workouts, lifting form breakdowns and protein recipes.",
    },
    "aaaaaaaa-0000-0000-0000-000000000003": {
        "name": "TEMP-Tech", "role": "creator", "niche": "Tech", "location": "Ho Chi Minh City",
        "bio": "I review laptops, mechanical keyboards and phone gadgets for students.",
    },
    "aaaaaaaa-0000-0000-0000-000000000004": {
        "name": "TEMP-CosmeticsBrand", "role": "brand", "niche": "Beauty", "location": "Hanoi",
        "bio": "Cosmetics company launching a new facial serum and moisturiser line.",
    },
    "aaaaaaaa-0000-0000-0000-000000000005": {
        "name": "TEMP-SupplementBrand", "role": "brand", "niche": "Fitness", "location": "Hanoi",
        "bio": "Sports nutrition brand selling whey protein and pre-workout supplements.",
    },
}

# (query, role filter, expected top result)
CASES = [
    ("skincare routines and makeup tutorials", None, "TEMP-Beauty"),
    ("someone who films workouts at the gym", "creator", "TEMP-Fitness"),
    ("reviews of laptops and keyboards", "creator", "TEMP-Tech"),
    ("company selling face serum", "brand", "TEMP-CosmeticsBrand"),
    ("protein powder company", "brand", "TEMP-SupplementBrand"),
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

        for query, role, expected in CASES:
            results = search_profiles(query, role=role, limit=3)
            top = results[0]["name"] if results else None
            ok = top == expected
            failures += 0 if ok else 1
            label = f' [role={role}]' if role else ""
            print(f'{"PASS" if ok else "FAIL"}  "{query}"{label}')
            print(f"        expected top: {expected}")
            for i, r in enumerate(results):
                print(f"        {i+1}. dist={r['distance']:.4f}  {r['name']}  ({r['role']})")
            # Role filter must hold for every returned row, not just the top one
            if role:
                bad = [r["name"] for r in results if r["role"] != role]
                if bad:
                    failures += 1
                    print(f"        FAIL: role filter leaked non-{role} rows: {bad}")
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
