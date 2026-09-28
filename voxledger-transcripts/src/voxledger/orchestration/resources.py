"""Dagster resources wiring the pipeline to MySQL and GCS."""

from __future__ import annotations

import dagster

from voxledger.db import TranscriptRepository
from voxledger.storage import GcsTranscriptStore


class MySqlMetadataResource(dagster.ConfigurableResource):
    """Connection settings for the VoxLedger MySQL metadata store."""

    url: str

    def repository(self) -> TranscriptRepository:
        from sqlalchemy import create_engine

        return TranscriptRepository(create_engine(self.url, pool_pre_ping=True))


class GcsBucketResource(dagster.ConfigurableResource):
    """The GCS bucket holding raw transcripts and published documents."""

    bucket: str

    def store(self) -> GcsTranscriptStore:
        return GcsTranscriptStore(self.bucket)
