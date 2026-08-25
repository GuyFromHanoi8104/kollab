"""Semantic search over the `kollab_profiles` Weaviate collection.

A plain callable -- no CrewAI Agent/Task/Crew, no Exa web search, no report
step. Just: query string in, ranked profiles out.

Connection follows the same pattern as WeaviateVectorSearchTool
(connect_to_weaviate_cloud + Auth.api_key + the X-OpenAI-Api-Key header the
text2vec_openai vectorizer needs to embed the query), with two differences:

  * `.query.near_text` instead of `.generate.near_text` -- there is no
    generation step here, so asking for one would spend gpt-4o-mini tokens
    on output nothing reads.
  * the client is closed in a `finally`, so a failed query doesn't leak the
    connection the way the original tool does.

Env (.env beside pyproject.toml): WEAVIATE_URL, WEAVIATE_API_KEY, OPENAI_API_KEY
"""

import os
from pathlib import Path

import weaviate
from dotenv import load_dotenv
from weaviate.classes.init import Auth
from weaviate.classes.query import Filter, MetadataQuery

# Resolved from this file, not the cwd -- see ingest_kollab_profiles.py.
PROJECT_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(PROJECT_ROOT / ".env")

COLLECTION_NAME = "kollab_profiles"
VALID_ROLES = ("creator", "brand")
# 1.0 = pure vector, 0.0 = pure keyword. Chosen by measurement, not taste:
# at 0.75 exact-name search failed 3 of 4 cases; at Weaviate's 0.5 default the
# right name ranked first but tied the runner-up at 0.000 margin, i.e. correct
# by luck. 0.4 separates names by ~0.2 while conceptual queries with no shared
# vocabulary ("someone who films themselves lifting heavy weights") still
# resolve correctly. Kept in an env var so it can be retuned once there are
# enough real profiles for BM25 noise to matter.
HYBRID_ALPHA = float(os.getenv("SEARCH_HYBRID_ALPHA", "0.4"))
RETURNED_FIELDS = ("profile_id", "name", "role", "handle", "bio", "niche", "location", "company_name")


def connect_client():
    """Open a Weaviate Cloud connection, raising early on missing config.

    Split out so a long-lived process (the FastAPI app) can open one
    connection at startup and reuse it, rather than paying a TLS handshake
    per request.
    """
    wcd_url = os.getenv("WEAVIATE_URL")
    wcd_api_key = os.getenv("WEAVIATE_API_KEY")
    openai_api_key = os.getenv("OPENAI_API_KEY")
    missing = [
        name
        for name, value in [
            ("WEAVIATE_URL", wcd_url),
            ("WEAVIATE_API_KEY", wcd_api_key),
            ("OPENAI_API_KEY", openai_api_key),
        ]
        if not value
    ]
    if missing:
        raise ValueError("Missing required environment variables: " + ", ".join(missing))

    return weaviate.connect_to_weaviate_cloud(
        cluster_url=wcd_url,
        auth_credentials=Auth.api_key(wcd_api_key),
        # The vectorizer embeds the *query* server-side at search time, so
        # this header is required for reads, not just for ingestion.
        headers={"X-OpenAI-Api-Key": openai_api_key},
    )


def search_profiles(
    query: str, role: str | None = None, limit: int = 5, client=None
) -> list[dict]:
    """Return the profiles most semantically similar to `query`.

    Args:
        query:  Free-text description, e.g. "beauty creator who reviews skincare".
        role:   Optional "creator" or "brand" to restrict results.
        limit:  Maximum number of profiles to return.
        client: Optional existing Weaviate client to reuse. When given, the
                caller owns its lifecycle and it is NOT closed here -- that's
                what lets the API share one pooled connection. When omitted,
                a connection is opened and closed around this single call.

    Returns:
        A list of plain dicts ordered best-match first. Each carries the
        profile fields plus `distance` (lower is closer; roughly 0-2 for
        cosine). Empty list if nothing matches.

    Raises:
        ValueError: on a blank query, a bad role, or missing credentials.
    """
    if not query or not query.strip():
        raise ValueError("query must be a non-empty string")
    if role is not None and role not in VALID_ROLES:
        raise ValueError(f"role must be one of {VALID_ROLES}, got {role!r}")

    owns_client = client is None
    if owns_client:
        client = connect_client()
    try:
        collection = client.collections.get(COLLECTION_NAME)
        # Hybrid, not pure near_text: `name` and `handle` are stored with
        # skip_vectorization (a person's name adds noise to an embedding
        # rather than meaning), so a vector-only search can never match
        # someone by name -- searching "Warren" returned whoever happened to
        # be semantically closest to the word. BM25 does match those fields,
        # because skip_vectorization only excludes a property from the
        # embedding, not from the inverted index.
        #
        # alpha blends the two: 1.0 is pure vector, 0.0 is pure keyword.
        # Default 0.5 keeps conceptual queries ("fitness creator in Hanoi")
        # working while exact names win on the keyword side.
        response = collection.query.hybrid(
            query=query,
            alpha=HYBRID_ALPHA,
            limit=limit,
            # `role` is skip_vectorization too, but still exact-match filterable.
            filters=Filter.by_property("role").equal(role) if role else None,
            return_metadata=MetadataQuery(score=True),
        )
        return [
            {
                **{field: obj.properties.get(field) for field in RETURNED_FIELDS},
                # Hybrid returns a fused relevance score (higher is better),
                # not a vector distance (lower is better). Different scale and
                # direction, so the key name changes with it.
                "score": obj.metadata.score,
            }
            for obj in response.objects
        ]
    finally:
        # Only close what this call opened -- closing an injected client
        # would kill the pooled connection for every later request.
        if owns_client:
            client.close()


if __name__ == "__main__":
    demos = [
        ("beauty creator who reviews skincare", None),
        ("fitness and gym content", "creator"),
        ("a company looking to run a campaign", "brand"),
    ]
    for demo_query, demo_role in demos:
        results = search_profiles(demo_query, role=demo_role)
        label = f" [role={demo_role}]" if demo_role else ""
        print(f'\n"{demo_query}"{label} -> {len(results)} result(s)')
        for r in results:
            print(
                f"   score={r['score']:.4f}  {str(r['name'])[:20]:22}"
                f"  role={r['role']:8} niche={r['niche'] or '-'}"
            )
