"""Dagster definitions for the VoxLedger transcript pipeline.

The ``transcripts_daily`` job runs every weekday at 11:00 UTC, after the
provider has delivered the previous US day's call transcripts to the GCS
landing bucket.
"""

from __future__ import annotations

import dagster

from voxledger.orchestration.assets import (
    daily_partitions,
    raw_transcripts,
    transcript_documents,
)
from voxledger.orchestration.resources import GcsBucketResource, MySqlMetadataResource

transcripts_job = dagster.define_asset_job(
    name="transcripts_daily",
    selection=dagster.AssetSelection.groups("transcripts"),
    partitions_def=daily_partitions,
    description="Daily load of provider transcripts into the VoxLedger stores.",
)

transcripts_schedule = dagster.ScheduleDefinition(
    name="transcripts_daily_schedule",
    job=transcripts_job,
    cron_schedule="0 11 * * 1-5",
    execution_timezone="UTC",
)

defs = dagster.Definitions(
    assets=[raw_transcripts, transcript_documents],
    jobs=[transcripts_job],
    schedules=[transcripts_schedule],
    resources={
        "gcs": GcsBucketResource(bucket=dagster.EnvVar("VOXLEDGER_GCS_BUCKET")),
        "mysql": MySqlMetadataResource(url=dagster.EnvVar("VOXLEDGER_MYSQL_URL")),
    },
)
