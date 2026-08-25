"""Shared Supabase-row -> Weaviate-object mapping for `kollab_profiles`.

Split out of ingest_kollab_profiles.py so the bulk ingest script and the
single-profile webhook handler (profile_webhook.py) map a row the same way --
duplicating this in two places is exactly how they'd quietly drift apart.
"""

COLLECTION_NAME = "kollab_profiles"

# Weaviate reserves `id` for the object UUID, so the Supabase id is stored as
# `profile_id` (and reused as the object UUID, which is what makes both bulk
# reruns and single-profile upserts idempotent).
#
# Only bio/niche/location carry real semantic meaning, so those are what the
# vectorizer embeds. Names, handles and UUIDs would just add noise to the
# vector -- they stay as retrievable/filterable properties instead, which is
# what BM25 and `Filter.by_property` are for on the query side.
#
# company_name matters specifically for brands: "name" is the account
# holder's own name (whoever signed up), not the business -- searching a
# brand by its actual company name had nothing to match against at all
# before this, only bio text a keyword search could get lucky on. Every
# creator row simply has this column null, so _text() below turns it into
# "" for them same as any other blank field.
SOURCE_COLUMNS = "id, name, role, bio, niche, location, handle, company_name"
VECTORIZED_FIELDS = ("bio", "niche", "location")

# The full set of columns a row needs unchanged in, for the webhook handler to
# skip re-embedding an UPDATE that only touched an unrelated column (avatar,
# follower counts, timestamps, ...).
INDEXED_FIELDS = ("name", "role", "bio", "niche", "location", "handle", "company_name")


def _text(value):
    return (value or "").strip()


def _text_list(value):
    """`profiles.niche` is a Postgres `text[]` column, not text.

    Tolerates a bare string too, so a legacy or hand-edited row can't crash
    a whole batch (or a single webhook delivery).
    """
    if value is None:
        return []
    if isinstance(value, str):
        return [value.strip()] if value.strip() else []
    return [str(v).strip() for v in value if str(v).strip()]


def to_properties(row):
    return {
        "profile_id": str(row["id"]),
        "name": _text(row.get("name")),
        "role": _text(row.get("role")),
        "bio": _text(row.get("bio")),
        "niche": _text_list(row.get("niche")),
        "location": _text(row.get("location")),
        "handle": _text(row.get("handle")),
        "company_name": _text(row.get("company_name")),
    }
