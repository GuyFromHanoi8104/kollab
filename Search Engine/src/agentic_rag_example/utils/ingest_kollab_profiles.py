"""Load real Kollab profiles from Supabase into a Weaviate collection.

Bulk / catch-up ingestion. Live sync for one profile at a time lives in
profile_webhook.py instead, wired to a Supabase Database Webhook -- this
script is what you rerun by hand to backfill everything at once (first setup,
after a schema change, or to recover a Weaviate sandbox that expired and took
the index with it). Follows the same Weaviate Cloud + text-embedding-3-small
pattern already proven in pre-process-docs.py.

Reruns are safe: each object is keyed by the profile's Supabase UUID, so a
second run overwrites rather than duplicating. Pass --recreate to drop and
rebuild the collection instead (needed after a schema change).

Env (.env alongside pyproject.toml):
    WEAVIATE_URL, WEAVIATE_API_KEY, OPENAI_API_KEY
    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (anon key works but RLS may hide rows)
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

from profile_transform import (
    COLLECTION_NAME,
    SOURCE_COLUMNS,
    VECTORIZED_FIELDS,
    to_properties,
)

# Resolved relative to this file rather than the cwd -- bare load_dotenv()
# walks up from the *caller's* directory, so running this from anywhere
# other than the project tree silently loads nothing and every key reads
# as None.
PROJECT_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(PROJECT_ROOT / ".env")

wcd_url = os.getenv("WEAVIATE_URL")
wcd_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")


def fetch_profiles(client):
    rows = []
    page_size = 1000
    start = 0
    while True:
        resp = (
            client.table("profiles")
            .select(SOURCE_COLUMNS)
            .range(start, start + page_size - 1)
            .execute()
        )
        batch = resp.data or []
        rows.extend(batch)
        if len(batch) < page_size:
            return rows
        start += page_size


def report_vector_coverage(profiles):
    """Warn when rows will be stored but carry no meaningful vector.

    A profile with every vectorized field blank still inserts fine, so the
    batch reports success -- but there is nothing for the embedding to
    represent, and semantic search can never rank it. That distinction is
    invisible from the object count alone, hence this explicit summary.
    """
    # Goes through to_properties rather than reading the raw row, so this
    # can't drift from what is actually sent (niche is a list, the rest text).
    embeddable = sum(
        1 for row in profiles
        if any(to_properties(row)[field] for field in VECTORIZED_FIELDS)
    )
    print(f"\n{embeddable}/{len(profiles)} profile(s) have text in {list(VECTORIZED_FIELDS)}.")
    if embeddable < len(profiles):
        print(
            "Profiles with none of those fields filled in are stored and filterable, "
            "but carry no meaningful vector -- semantic search can't rank them."
        )
    return embeddable


def create_collection(client):
    return client.collections.create(
        name=COLLECTION_NAME,
        vectorizer_config=Configure.Vectorizer.text2vec_openai(
            model="text-embedding-3-small",
        ),
        generative_config=Configure.Generative.openai(
            model="gpt-4o-mini",
        ),
        properties=[
            Property(name="profile_id", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="name", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="role", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="handle", data_type=DataType.TEXT, skip_vectorization=True),
            # Keyword-searchable like name/handle, not embedded -- a company
            # name isn't semantic content, it's an identifier someone types
            # expecting an exact-ish match, same as searching a person by name.
            Property(name="company_name", data_type=DataType.TEXT, skip_vectorization=True),
            # vectorize_property_name=False keeps the literal words "bio"/"niche"
            # out of the embedded text -- only the values themselves are embedded.
            Property(name="bio", data_type=DataType.TEXT, vectorize_property_name=False),
            # TEXT_ARRAY mirrors the source text[] column. Weaviate joins the
            # elements for embedding, and it stays filterable with
            # contains_any(), which a joined string would not be.
            Property(name="niche", data_type=DataType.TEXT_ARRAY, vectorize_property_name=False),
            Property(name="location", data_type=DataType.TEXT, vectorize_property_name=False),
        ],
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--recreate",
        action="store_true",
        help="Delete the collection and rebuild it from scratch (destroys existing objects).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch from Supabase and report what would be sent, without touching "
             "Weaviate or spending any OpenAI embedding tokens.",
    )
    args = parser.parse_args()

    required = [
        ("SUPABASE_URL", supabase_url),
        ("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY", supabase_key),
    ]
    if not args.dry_run:
        required += [
            ("WEAVIATE_URL", wcd_url),
            ("WEAVIATE_API_KEY", wcd_api_key),
            ("OPENAI_API_KEY", openai_api_key),
        ]
    missing = [name for name, value in required if not value]
    if missing:
        sys.exit("Missing required environment variables: " + ", ".join(missing))

    print("Fetching profiles from Supabase...")
    profiles = fetch_profiles(create_client(supabase_url, supabase_key))
    if not profiles:
        sys.exit("No profiles returned from Supabase -- nothing to ingest.")
    print(f"Fetched {len(profiles)} profile(s).")

    if args.dry_run:
        print(f"\n--dry-run: would upsert into '{COLLECTION_NAME}'. Sample object:")
        sample = to_properties(profiles[0])
        for key, value in sample.items():
            shown = value if value else "(empty)"
            print(f"    {key:11} = {shown}")
        report_vector_coverage(profiles)
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
            for row in profiles:
                # Supabase UUID doubles as the Weaviate object UUID so reruns
                # overwrite the same object instead of duplicating it.
                batch.add_object(properties=to_properties(row), uuid=str(row["id"]))

        failed = collection.batch.failed_objects
        if failed:
            print(f"WARNING: {len(failed)} object(s) failed to insert. First error:")
            print(f"  {failed[0].message}")
        else:
            print(f"Successfully ingested {len(profiles)} profile(s) into '{COLLECTION_NAME}'.")

        report_vector_coverage(profiles)
    finally:
        client.close()
        print("Weaviate client connection closed cleanly.")


if __name__ == "__main__":
    main()
