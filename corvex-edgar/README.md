# corvex-edgar

The original Corvex ingestion core, built in-house in 2017 and mapped earliest onto the
company's data platform. It ingests SEC EDGAR full-text submissions every weekday morning,
parses the submission header and item sections, normalizes them into the house filing
dialect, and loads the result into Postgres. Raw submissions are archived in S3; the batch
runs as a Spark job on EKS and is orchestrated by Airflow.

The codebase predates the acquisitions and keeps its original shape: a Java monolith that
was later split into a Maven build with a batch entry point, with the run-coordination
logic (partition claims, worker heartbeats, startup recovery) living next to the parsers.

## Stack

- Java 17, Maven 3.9 via the Maven Wrapper (`./mvnw`)
- Spark 3.5 batch job (`com.corvex.edgar.spark.FilingsBatchJob`) on EKS
- Airflow 2 DAG with classic operators (`orchestration/airflow/`)
- Postgres metadata store (Flyway-style migrations in `db/migrations/`)
- S3 raw document store (`s3://corvex-edgar-raw/<cik>/<accession>.txt`)
- JUnit 5 tests; SLF4J + Logback logging; Jackson for the JSON wire form

## Layout

```
pom.xml                  parent build (modules: vendor-stubs, edgar-core)
vendor-stubs/            compile-only mirrors of the Spark 3.5 and AWS SDK v2 S3 APIs
edgar-core/              the library and batch job
  parse/                 submission header parser, item section splitter
  normalize/             CIK, form type, fiscal period
  map/                   FilingRecordMapper -> {filing, filing_section[]}
  runs/                  PartitionRunCoordinator, claim ledger, worker registry
  store/                 JDBC repositories and the S3 raw store
  spark/                 the Spark batch entry point
db/migrations/           V1 filings, V2 filing sections, V3 run claims
orchestration/airflow/   the daily DAG (uv project: ruff + mypy, local Airflow stubs)
deploy/                  Dockerfile and EKS manifests
samples/                 raw submissions (samples/raw) and expected records (samples/golden)
```

## Output dialect

Filings are keyed by the zero-padded 10-digit CIK with the EDGAR conformed (upper-case)
company name. Dates are plain `YYYY-MM-DD`; field names are snake_case; `seq` numbers
sections from 1 in document order; `char_count` is the character length of the section
text. The filing record carries no ticker — CIK is the identity.

```json
{
  "filing": {
    "accession_no": "0001045810-26-000112",
    "cik": "0001045810",
    "company_name": "NVIDIA CORP",
    "form_type": "10-Q",
    "period_of_report": "2026-07-26",
    "filed_date": "2026-08-27",
    "fiscal_year": 2027,
    "fiscal_period": "Q2",
    "raw_uri": "s3://corvex-edgar-raw/0001045810/0001045810-26-000112.txt",
    "ingest_batch_id": "edgar-20260927-01"
  },
  "filing_section": [
    {
      "accession_no": "0001045810-26-000112",
      "seq": 1,
      "section_code": "PART_I_ITEM_1",
      "section_title": "Financial Statements",
      "char_count": 364,
      "text": "Item 1. Financial Statements\n\n..."
    }
  ]
}
```

## Commands

Build and run the unit tests (requires JDK 17 via `JAVA_HOME`):

```sh
./mvnw -B -q verify
```

Check the Airflow DAG project (requires `uv`):

```sh
cd orchestration/airflow
uv sync --frozen
uv run ruff check .
uv run mypy
```

From the repository root, `scripts/check-backends.sh edgar` runs all of the above.

## A note on the vendor APIs

The Spark job and the S3 store are compiled against `vendor-stubs/`, a compile-only mirror
of the Spark 3.5.9 and AWS SDK for Java 2.x (S3) APIs, consumed with Maven `provided`
scope — the same way a real Spark deployment treats the cluster's Spark distribution.
Nothing in `vendor-stubs/` is packaged into the `edgar-core` jar or executed; every stub
method throws `UnsupportedOperationException`. The Airflow DAGs are likewise type-checked
against local `.pyi` stubs of Airflow 2.11 (`orchestration/airflow/stubs/`), so Airflow
itself is never installed here. Unit tests exercise only the pure parsing, normalization,
mapping, and run-coordination logic; the Spark job, JDBC repositories, and S3 store run
only on the cluster.
