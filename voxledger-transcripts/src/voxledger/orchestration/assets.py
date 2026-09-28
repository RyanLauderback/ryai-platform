"""Dagster assets for the daily transcript load.

Two daily-partitioned assets: one stages the day's raw provider transcripts
from GCS, the other parses, diarizes, normalizes, and maps each transcript
to the published document dialect, writes the document back to GCS, and
persists its metadata to MySQL. Calls whose header ticker cannot be keyed
are left out of the load.
"""

from __future__ import annotations

import dagster

from voxledger.mapping import build_document, document_to_json
from voxledger.orchestration.resources import GcsBucketResource, MySqlMetadataResource
from voxledger.parsing import TranscriptFormatError, parse_transcript

daily_partitions = dagster.DailyPartitionsDefinition(
    start_date="2026-06-01", timezone="UTC"
)


@dagster.asset(
    partitions_def=daily_partitions,
    group_name="transcripts",
    compute_kind="python",
    description="Raw provider transcripts for one call date, staged from GCS.",
)
def raw_transcripts(
    context: dagster.AssetExecutionContext, gcs: GcsBucketResource
) -> list[str]:
    store = gcs.store()
    day = context.partition_key
    blob_names = store.list_transcripts(f"calls/{day}/")
    context.log.info("staging %d raw transcripts for %s", len(blob_names), day)
    return [store.read_transcript(name) for name in blob_names]


@dagster.asset(
    partitions_def=daily_partitions,
    group_name="transcripts",
    compute_kind="python",
    description="Parsed, normalized transcript documents persisted to GCS and MySQL.",
)
def transcript_documents(
    context: dagster.AssetExecutionContext,
    raw_transcripts: list[str],
    gcs: GcsBucketResource,
    mysql: MySqlMetadataResource,
) -> dagster.MaterializeResult:
    store = gcs.store()
    repository = mysql.repository()
    day = context.partition_key
    loaded = 0
    for raw in raw_transcripts:
        try:
            parsed = parse_transcript(raw)
        except TranscriptFormatError:
            context.log.warning("skipping malformed transcript in %s", day)
            continue
        document = build_document(parsed)
        if document is None:
            continue
        blob_name = f"documents/{day}/{document['callId']}.json"
        gcs_uri = store.write_document(blob_name, document_to_json(document))
        repository.save_document(document, gcs_uri)
        loaded += 1
    context.log.info("loaded %d transcript documents for %s", loaded, day)
    return dagster.MaterializeResult(
        metadata={
            "loaded": dagster.MetadataValue.int(loaded),
            "received": dagster.MetadataValue.int(len(raw_transcripts)),
        }
    )
