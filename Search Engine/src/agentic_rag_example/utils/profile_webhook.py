"""Single-profile Weaviate sync, driven by a Supabase Database Webhook.

ingest_kollab_profiles.py is the bulk/catch-up path -- someone reruns it by
hand. This module is the live path: Supabase calls the API's
POST /webhooks/profiles endpoint on every INSERT/UPDATE/DELETE to `profiles`,
and handle_profile_change() keeps exactly that one Weaviate object in sync,
so a new signup is searchable within seconds instead of waiting on the next
manual rerun.

Payload shape (Supabase's Database Webhook format):
    {"type": "INSERT" | "UPDATE" | "DELETE", "table": "profiles",
     "schema": "public", "record": {...} | null, "old_record": {...} | null}

Two things ingest_kollab_profiles.py doesn't have to deal with, that a live
per-row handler does:

  * insert() errors if the uuid already exists, replace() errors if it
    doesn't -- there is no single-call upsert. exists() first, then pick.
  * DELETE has no equivalent in the bulk script at all: a full rerun only
    ever adds/updates, so a profile deleted from Supabase stays in Weaviate
    forever unless something explicitly removes it. This is that something.
"""

from profile_transform import INDEXED_FIELDS, COLLECTION_NAME, to_properties

VALID_TYPES = ("INSERT", "UPDATE", "DELETE")


def _relevant_fields_changed(old_record, record):
    """Skip re-embedding an UPDATE that didn't touch anything Weaviate holds.

    profiles rows change constantly for reasons search doesn't care about --
    avatar uploads, follower counts, stats_verified, connection timestamps.
    Every one of those would otherwise trigger a real OpenAI embedding call
    for no reason. Comparing on the same INDEXED_FIELDS to_properties() reads
    (rather than raw columns) means this can't drift out of sync with what
    actually gets sent to Weaviate.
    """
    old_props = to_properties(old_record or {})
    new_props = to_properties(record or {})
    return any(old_props[f] != new_props[f] for f in INDEXED_FIELDS)


def handle_profile_change(payload: dict, client) -> dict:
    """Apply one Supabase Database Webhook delivery to the Weaviate index.

    `client` is the pooled Weaviate connection (app.state.weaviate), same as
    /search uses -- never opened per-request.

    Returns a small dict describing what happened, for the endpoint to log
    and echo back; never raises for a well-formed payload, so one bad
    delivery can't take the endpoint down for the next one.
    """
    event_type = payload.get("type")
    if event_type not in VALID_TYPES:
        return {"action": "skipped", "reason": f"unknown type {event_type!r}"}

    table = payload.get("table")
    if table != "profiles":
        return {"action": "skipped", "reason": f"unexpected table {table!r}"}

    record = payload.get("record")
    old_record = payload.get("old_record")
    row = record if event_type != "DELETE" else old_record
    if not row or not row.get("id"):
        return {"action": "skipped", "reason": "payload had no row id"}

    profile_id = str(row["id"])
    collection = client.collections.get(COLLECTION_NAME)

    if event_type == "DELETE":
        collection.data.delete_by_id(profile_id)
        return {"action": "deleted", "profile_id": profile_id}

    if event_type == "UPDATE" and not _relevant_fields_changed(old_record, record):
        return {"action": "skipped", "reason": "no indexed field changed", "profile_id": profile_id}

    properties = to_properties(record)
    if collection.data.exists(profile_id):
        collection.data.replace(uuid=profile_id, properties=properties)
        return {"action": "replaced", "profile_id": profile_id}

    collection.data.insert(properties=properties, uuid=profile_id)
    return {"action": "inserted", "profile_id": profile_id}
