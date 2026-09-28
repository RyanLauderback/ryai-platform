# Compile-only stubs

These `.pyi` files are a type-check-only mirror of the third-party APIs this project uses
in production but intentionally does not install in development:

- `dagster/` mirrors the subset of the Dagster 1.13 API (`dagster==1.13.24`) used by
  `src/voxledger/orchestration/`: `asset`, `AssetExecutionContext`, `AssetSelection`,
  `ConfigurableResource`, `DailyPartitionsDefinition`, `define_asset_job`, `Definitions`,
  `EnvVar`, `JobDefinition`, `MaterializeResult`, `MetadataValue`, and
  `ScheduleDefinition`.
- `google/cloud/storage/` mirrors the subset of the google-cloud-storage client (3.x API)
  used by `src/voxledger/storage/`: `Client`, `Bucket`, and `Blob`.

`mypy` picks these up via `mypy_path = "stubs"` in `pyproject.toml`, so the orchestration
and storage code type-checks against the real import paths and signatures. The stubs
contain no runtime code: they are never imported when the code actually runs, and the real
packages are present in the production container image instead (see `deploy/Dockerfile`).
