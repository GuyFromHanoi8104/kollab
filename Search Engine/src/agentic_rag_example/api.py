"""HTTP wrapper around search_profiles().

    uvicorn agentic_rag_example.api:app --app-dir "src" --reload

One endpoint: POST /search. No auth -- guest search is intentional, matching
how Discover Creators already works for logged-out visitors.

Deliberate choices worth knowing:

  * One Weaviate connection is opened in the lifespan handler and shared by
    every request. Connecting per request would add a TLS handshake to each
    search and, under load, exhaust sockets.
  * Every search costs money: the text2vec_openai vectorizer embeds the
    query server-side on each call. That is why there is a per-IP rate
    limit even though the endpoint is public and unauthenticated.
  * Validation errors return 400, not FastAPI's default 422, so a missing
    or blank query reads the same as any other bad request.
"""

import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# `utils` has no __init__.py, so it isn't importable as a package -- same
# sys.path approach test_search_relevance.py already uses.
sys.path.insert(0, str(Path(__file__).resolve().parent / "utils"))
from search_profiles import VALID_ROLES, connect_client, search_profiles  # noqa: E402

MAX_LIMIT = 25
DEFAULT_RATE_LIMIT = "20/minute"

# Both resolve to the Vercel deployment. Overridable so Task 4 can add a
# staging origin without a code change. Note "*" is deliberately NOT used:
# with credentials disabled it would still let any site spend your OpenAI
# quota through a victim's browser.
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "https://appkollab.com,https://www.appkollab.com,http://localhost:5173",
    ).split(",")
    if o.strip()
]

# How many proxy hops sit in front of this app. Railway terminates TLS at its
# edge and appends to X-Forwarded-For, so the real client is 1 from the right.
TRUSTED_PROXY_HOPS = int(os.getenv("TRUSTED_PROXY_HOPS", "1"))


def client_ip(request: Request) -> str:
    """Rate-limit key that survives a reverse proxy.

    Behind any managed host, request.client.host is the load balancer, so
    every user in the world would share a single bucket and the limit would
    be useless.

    Reads X-Forwarded-For from the RIGHT, not the left. Anyone can send their
    own X-Forwarded-For header; a proxy appends to it rather than replacing
    it, so the leftmost entry is attacker-controlled -- rotating it would
    bypass the limit completely, which is exactly the abuse this limit
    exists to stop. The Nth-from-right entry is what the trusted proxy
    actually observed.

    Falls back to request.client.host when the header is absent (local runs).
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        hops = [part.strip() for part in forwarded.split(",") if part.strip()]
        if hops:
            index = min(TRUSTED_PROXY_HOPS, len(hops))
            return hops[-index]
    return get_remote_address(request)


limiter = Limiter(key_func=client_ip, default_limits=[])


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Open the shared Weaviate connection once, close it on shutdown.

    A startup failure is recorded rather than raised. Raising here kills the
    container, so the platform reports only "healthcheck failure" -- the app
    is dead and cannot serve the one endpoint that would explain why. Staying
    up and reporting "degraded" on /health turns a blind restart loop into a
    readable error, whether the cause is a missing env var or Weaviate being
    briefly unreachable.
    """
    app.state.weaviate = None
    app.state.startup_error = None
    try:
        client = connect_client()
        if not client.is_ready():
            client.close()
            raise RuntimeError("connected, but Weaviate reported not ready")
        app.state.weaviate = client
    except Exception as exc:  # noqa: BLE001 - must not take the process down
        app.state.startup_error = f"{type(exc).__name__}: {exc}"
        print(f"STARTUP ERROR: {app.state.startup_error}", flush=True)
    try:
        yield
    finally:
        if app.state.weaviate is not None:
            app.state.weaviate.close()


app = FastAPI(title="Kollab Search API", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class SearchRequest(BaseModel):
    query: str = Field(..., description="Free-text description of who to find.")
    role: str | None = Field(None, description='Optional "creator" or "brand".')
    limit: int = Field(5, ge=1, le=MAX_LIMIT)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    """Return 400 for malformed bodies instead of FastAPI's default 422."""
    detail = exc.errors()[0] if exc.errors() else {}
    field = ".".join(str(p) for p in detail.get("loc", []) if p != "body") or "body"
    return JSONResponse(status_code=400, content={"detail": f"{field}: {detail.get('msg', 'invalid request')}"})


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": f"Rate limit exceeded ({exc.detail}). Please slow down."},
    )


@app.get("/health")
def health(request: Request):
    state = request.app.state
    ready = False
    if state.weaviate is not None:
        try:
            ready = state.weaviate.is_ready()
        except Exception as exc:  # noqa: BLE001 - health must never 500
            state.startup_error = f"{type(exc).__name__}: {exc}"

    # Always 200 while the process is alive, so the platform healthcheck
    # passes and this stays reachable to report what is actually wrong.
    return {
        "status": "ok" if ready else "degraded",
        "weaviate_ready": ready,
        "startup_error": state.startup_error,
        # Echoes back the key this caller is rate-limited under. Without it
        # there is no way to tell from outside whether the proxy fix actually
        # works in the hosted environment -- if this shows the load balancer
        # instead of your own IP, every user is sharing one bucket. Only ever
        # reveals the caller's own address to themselves.
        "rate_limit_key": client_ip(request),
    }


@app.post("/search")
@limiter.limit(os.getenv("SEARCH_RATE_LIMIT", DEFAULT_RATE_LIMIT))
def search(request: Request, body: SearchRequest):
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="query must not be empty")
    if body.role is not None and body.role not in VALID_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"role must be one of {list(VALID_ROLES)}, got {body.role!r}",
        )

    if request.app.state.weaviate is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Search is unavailable: "
                f"{request.app.state.startup_error or 'no Weaviate connection'}"
            ),
        )

    try:
        results = search_profiles(
            body.query,
            role=body.role,
            limit=body.limit,
            # The pooled connection -- not a fresh one per request.
            client=request.app.state.weaviate,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "query": body.query,
        "role": body.role,
        "count": len(results),
        "results": results,
    }
