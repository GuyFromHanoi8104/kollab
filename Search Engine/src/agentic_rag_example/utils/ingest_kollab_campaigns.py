"""Load real Kollab campaigns from Supabase into a Weaviate collection.

Sibling of ingest_kollab_profiles.py, same one-time/manually-rerun scope.
Campaigns live in their own collection rather than sharing kollab_profiles:
the two have almost no properties in common, and mixing them would mean
every profile search had to filter out campaigns and vice versa.

Reruns are safe -- each object is keyed by the campaign's Supabase UUID, so
a second run overwrites rather than duplicating. Pass --recreate to drop and
rebuild (needed after a schema change).

Env (.env beside pyproject.toml):
    WEAVIATE_URL, WEAVIATE_API_KEY, OPENAI_API_KEY
    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
"""

import argparse
import os
import sys
from pathlib import Path

import weaviate
from dotenv import load_dotenv
from supabase import create_client
from weaviate.classes.config import Configure, DataType, Property
from weaviate.classes.init import Auth

PROJECT_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(PROJECT_ROOT / ".env")

wcd_url = os.getenv("WEAVIATE_URL")
wcd_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

COLLECTION_NAME = "kollab_campaigns"
SOURCE_COLUMNS = "id, name, brand_id, niche, brief, platforms, status"

# Unlike profiles, the brand name IS worth embedding here: "a Nike campaign"
# is a reasonable thing to search for, whereas a creator's personal name adds
# nothing a keyword match wouldn't do better.
VECTORIZED_FIELDS = ("name", "brief", "niche", "platforms", "brand_name")


def _text(value):
    return (value or "").strip()


def _text_list(value):
    """campaigns.platforms is text[]; campaigns.niche is plain text."""
    if value is None:
        return []
    if isinstance(value, str):
        return [value.strip()] if value.strip() else []
    return [str(v).strip() for v in value if str(v).strip()]


def fetch_campaigns(client):
    rows = []
    page_size = 1000
    start = 0
    while True:
        resp = (
            client.table("campaigns")
            .select(SOURCE_COLUMNS)
            .range(start, start + page_size - 1)
            .execute()
        )
        batch = resp.data or []
        rows.extend(batch)
        if len(batch) < page_size:
            break
        start += page_size

    # Campaigns don't carry the brand name -- it lives on the owning profile.
    brand_ids = list({r["brand_id"] for r in rows if r.get("brand_id")})
    names = {}
    if brand_ids:
        profiles = (
            client.table("profiles")
            .select("id, name, company_name")
            .in_("id", brand_ids)
            .execute()
        )
        for p in profiles.data or []:
            names[p["id"]] = p.get("company_name") or p.get("name") or ""
    for r in rows:
        r["brand_name"] = names.get(r.get("brand_id"), "")
    return rows


def to_properties(row):
    return {
        "campaign_id": str(row["id"]),
        "name": _text(row.get("name")),
        "brand_id": str(row.get("brand_id") or ""),
        "brand_name": _text(row.get("brand_name")),
        "niche": _text(row.get("niche")),
        "brief": _text(row.get("brief")),
        "platforms": _text_list(row.get("platforms")),
        "status": _text(row.get("status")),
    }


def report_vector_coverage(campaigns):
    embeddable = sum(
        1 for row in campaigns
        if any(to_properties(row)[field] for field in VECTORIZED_FIELDS)
    )
    print(f"\n{embeddable}/{len(campaigns)} campaign(s) have text in {list(VECTORIZED_FIELDS)}.")
    if embeddable < len(campaigns):
        print(
            "Campaigns with none of those filled in are stored and filterable, "
            "but carry no meaningful vector -- semantic search can't rank them."
        )
    return embeddable


def create_collection(client):
    return client.collections.create(
        name=COLLECTION_NAME,
        vectorizer_config=Configure.Vectorizer.text2vec_openai(model="text-embedding-3-small"),
        generative_config=Configure.Generative.openai(model="gpt-4o-mini"),
        properties=[
            Property(name="campaign_id", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="brand_id", data_type=DataType.TEXT, skip_vectorization=True),
            # Filterable so a search can be limited to live campaigns.
            Property(name="status", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="name", data_type=DataType.TEXT, vectorize_property_name=False),
            Property(name="brand_name", data_type=DataType.TEXT, vectorize_property_name=False),
            Property(name="niche", data_type=DataType.TEXT, vectorize_property_name=False),
            Property(name="brief", data_type=DataType.TEXT, vectorize_property_name=False),
            Property(name="platforms", data_type=DataType.TEXT_ARRAY, vectorize_property_name=False),
        ],
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--recreate", action="store_true",
                        help="Delete the collection and rebuild it (destroys existing objects).")
    parser.add_argument("--dry-run", action="store_true",
                        help="Fetch from Supabase and report what would be sent, without "
                             "touching Weaviate or spending embedding tokens.")
    args = parser.parse_args()

    required = [("SUPABASE_URL", supabase_url), ("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY", supabase_key)]
    if not args.dry_run:
        required += [("WEAVIATE_URL", wcd_url), ("WEAVIATE_API_KEY", wcd_api_key), ("OPENAI_API_KEY", openai_api_key)]
    missing = [name for name, value in required if not value]
    if missing:
        sys.exit("Missing required environment variables: " + ", ".join(missing))

    print("Fetching campaigns from Supabase...")
    campaigns = fetch_campaigns(create_client(supabase_url, supabase_key))
    if not campaigns:
        sys.exit("No campaigns returned from Supabase -- nothing to ingest.")
    print(f"Fetched {len(campaigns)} campaign(s).")

    if args.dry_run:
        print(f"\n--dry-run: would upsert into '{COLLECTION_NAME}'. Sample object:")
        for key, value in to_properties(campaigns[0]).items():
            print(f"    {key:12} = {value if value else '(empty)'}")
        report_vector_coverage(campaigns)
        print("\nNo Weaviate call made, no embedding tokens spent.")
        return

    print("Connecting to Weaviate Cloud...")
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=wcd_url,
        auth_credentials=Auth.api_key(wcd_api_key),
        headers={"X-OpenAI-Api-Key": openai_api_key},
    )
    try:
        if not client.is_ready():
            sys.exit("Weaviate client is not ready. Check WEAVIATE_URL / WEAVIATE_API_KEY.")

        exists = client.collections.exists(COLLECTION_NAME)
        if exists and args.recreate:
            print(f"--recreate: deleting existing collection '{COLLECTION_NAME}'...")
            client.collections.delete(COLLECTION_NAME)
            exists = False

        if exists:
            print(f"Collection '{COLLECTION_NAME}' already exists -- upserting into it.")
            collection = client.collections.get(COLLECTION_NAME)
        else:
            print(f"Creating collection '{COLLECTION_NAME}'...")
            collection = create_collection(client)

        print("Starting dynamic batch vector insertion...")
        with collection.batch.dynamic() as batch:
            for row in campaigns:
                batch.add_object(properties=to_properties(row), uuid=str(row["id"]))

        failed = collection.batch.failed_objects
        if failed:
            print(f"WARNING: {len(failed)} object(s) failed to insert. First error:")
            print(f"  {failed[0].message}")
        else:
            print(f"Successfully ingested {len(campaigns)} campaign(s) into '{COLLECTION_NAME}'.")

        report_vector_coverage(campaigns)
    finally:
        client.close()
        print("Weaviate client connection closed cleanly.")


if __name__ == "__main__":
    main()
