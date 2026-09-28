# VoxLedger Transcripts

Ingestion and normalization backend for earnings-call transcripts, originally built by
VoxLedger, a speech-analytics startup that sold ASR-diarized call transcripts to
quantitative funds. VoxLedger was acquired by Corvex in 2021. The service still runs on
its original stack — the team was a Python/Dagster shop on GCP, and the acquisition
never justified a re-platform — so it keeps its own Dagster orchestration on GKE, MySQL
metadata store, and GCS transcript buckets.

## Stack

- Python 3.12, packaged with [uv](https://docs.astral.sh/uv/) (`pyproject.toml` +
  committed `uv.lock`)
- Dagster 1.13 assets, jobs, and schedules (`src/voxledger/orchestration/`)
- MySQL metadata via SQLAlchemy 2 typed models + PyMySQL (`src/voxledger/db/`)
- Google Cloud Storage for raw transcripts and published documents
  (`src/voxledger/storage/`)
- pytest + ruff + mypy (strict) for quality gates
- stdlib `logging` with a JSON formatter (`src/voxledger/logging_config.py`)

## Layout

```
src/voxledger/
├── parsing/         provider transcript parser (header block + [HH:MM:SS] speaker turns)
├── diarization/     speaker id assignment, turn merging, PREPARED_REMARKS/QA detection
├── normalize/       ticker normalization and mention extraction
├── mapping/         mapping to the published camelCase document dialect
├── db/              SQLAlchemy 2 models + repository (MySQL via PyMySQL)
├── storage/         GCS transcript store
└── orchestration/   Dagster resources, assets, job, schedule, Definitions
stubs/               compile-only .pyi mirrors of dagster and google.cloud.storage
samples/raw/         raw provider transcripts (inputs)
samples/golden/      published documents (expected outputs)
deploy/              Dockerfile + GKE manifests
tests/               pytest suite (pure logic only)
```

## Output dialect

Each call is published as a camelCase JSON document. The company is identified by
ticker and exchange, the event time is epoch milliseconds (UTC), speaker turns carry
millisecond offsets relative to the call start, and sections split prepared remarks
from Q&A at the operator's hand-off. Example (excerpt from the Nvidia FY27 Q2 call):

```json
{
  "callId": "vx_nvda_2027q2",
  "tickerSymbol": "NVDA",
  "exchange": "NASDAQ",
  "companyName": "Nvidia",
  "eventDate": 1787702400000,
  "fiscalQuarter": "Q2 FY27",
  "speakers": [
    {
      "speakerId": "spk_0",
      "name": "Dana Cole",
      "role": "Operator",
      "affiliation": "VoxLedger"
    }
  ],
  "segments": [
    {
      "speakerId": "spk_0",
      "startMs": 0,
      "endMs": 41000,
      "section": "PREPARED_REMARKS",
      "text": "Good day, and welcome to the Nvidia second quarter fiscal 2027 ..."
    }
  ],
  "mentionedTickers": ["TSLA", "MSFT"],
  "provider": "voxledger-asr-v3",
  "schemaVersion": 3
}
```

## Commands

```sh
uv sync --frozen      # create .venv from the committed lockfile
uv run ruff check .   # lint
uv run mypy           # type-check (strict; orchestration/storage checked against stubs/)
uv run pytest -q      # unit + golden tests
```

From the repository root, `scripts/check-backends.sh voxledger` runs the same gate set.

## Stub note

Dagster and google-cloud-storage are **not** installed in development. The `.pyi` files
under `stubs/` mirror the subset of their APIs this service uses (Dagster 1.13,
google-cloud-storage 3.x) so mypy can type-check the orchestration and storage glue.
The unit tests import only the pure logic (`parsing`, `diarization`, `normalize`,
`mapping`) and never touch Dagster, GCS, or MySQL. The production image installs the
real packages (see `deploy/Dockerfile`).

## Configuration

Runtime configuration comes from the environment; defaults are development
placeholders:

| Variable               | Purpose                              | Default placeholder                                                          |
| ---------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `VOXLEDGER_MYSQL_URL`  | SQLAlchemy URL for the metadata DB   | `mysql+pymysql://voxledger:changeme@voxledger-mysql.internal:3306/voxledger` |
| `VOXLEDGER_GCS_BUCKET` | Bucket holding raw + published calls | `voxledger-transcripts-dev`                                                  |
