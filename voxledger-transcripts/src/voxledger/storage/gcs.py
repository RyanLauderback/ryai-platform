"""GCS-backed store for raw provider transcripts and published documents.

Raw transcripts land under ``calls/<YYYY-MM-DD>/<call-id>.txt``; published
documents are written to ``documents/<YYYY-MM-DD>/<call-id>.json``.
"""

from __future__ import annotations

import logging

from google.cloud import storage

log = logging.getLogger(__name__)


class GcsTranscriptStore:
    """Thin wrapper over the GCS client for the transcript bucket."""

    def __init__(
        self, bucket_name: str, client: storage.Client | None = None
    ) -> None:
        self._client = client if client is not None else storage.Client()
        self._bucket_name = bucket_name

    def list_transcripts(self, prefix: str) -> list[str]:
        """List raw transcript blob names under a prefix, in name order."""
        blobs = self._client.list_blobs(self._bucket_name, prefix=prefix)
        return sorted(blob.name for blob in blobs)

    def read_transcript(self, blob_name: str) -> str:
        """Download a raw transcript as text."""
        log.info("reading gs://%s/%s", self._bucket_name, blob_name)
        blob = self._client.bucket(self._bucket_name).blob(blob_name)
        return blob.download_as_text()

    def write_document(self, blob_name: str, payload: str) -> str:
        """Upload a published document and return its gs:// URI."""
        log.info("writing gs://%s/%s", self._bucket_name, blob_name)
        blob = self._client.bucket(self._bucket_name).blob(blob_name)
        blob.upload_from_string(payload, content_type="application/json")
        return f"gs://{self._bucket_name}/{blob_name}"
