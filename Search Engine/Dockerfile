# Explicit Dockerfile rather than letting Railway's Nixpacks auto-detect the
# build. Nixpacks looks for pyproject.toml, finds the CrewAI stack (crewai,
# docling, streamlit) and installs all of it -- none of which the API
# imports, and whose starlette<0.38.0 pin cannot coexist with FastAPI.
# Installing only requirements-api.txt is what keeps that guarantee.

FROM python:3.12-slim

WORKDIR /app

# Dependencies before source, so editing a .py file doesn't reinstall them.
COPY requirements-api.txt .
RUN pip install --no-cache-dir -r requirements-api.txt

COPY src/ ./src/

# Unbuffered so uvicorn logs reach Railway's log view immediately rather
# than sitting in a pipe buffer.
ENV PYTHONUNBUFFERED=1

# Declarative only -- it does not change what uvicorn binds to. It exists so
# Railway can infer the target port for a generated domain. Without it the
# edge proxy guessed a different port than the app was listening on, which
# surfaces as a 502 "Application failed to respond" even though the
# container is healthy and passing its internal healthcheck. 8080 is the
# value Railway injects as $PORT by default.
EXPOSE 8080

# Shell form, so ${PORT} (injected by Railway at runtime) actually expands.
#
# --workers 1 is deliberate and load-bearing: the rate limiter keeps its
# counters in memory, so a second worker would hold a second independent
# set and double the effective limit. Raising this requires moving the
# limiter to Redis first.
CMD uvicorn agentic_rag_example.api:app --app-dir src --host 0.0.0.0 --port ${PORT:-8000} --workers 1
