# Production image for the VoxLedger Dagster code location on GKE.
#
# The development environment type-checks the orchestration and storage glue
# against compile-only stubs (see stubs/); the production image installs the
# real Dagster and google-cloud-storage packages on top of the locked
# project dependencies.
FROM python:3.12-slim AS runtime

COPY --from=ghcr.io/astral-sh/uv:0.12.8 /uv /bin/uv

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

COPY pyproject.toml uv.lock .python-version README.md ./
COPY src ./src
RUN uv sync --frozen --no-dev --no-editable

RUN uv pip install --python /app/.venv/bin/python \
    "dagster==1.13.24" \
    "google-cloud-storage==3.4.0"

EXPOSE 3030
CMD ["dagster", "api", "grpc", \
     "--module-name", "voxledger.orchestration", \
     "--host", "0.0.0.0", "--port", "3030"]
