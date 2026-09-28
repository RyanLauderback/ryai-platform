"""Build the camelCase transcript document published to downstream consumers.

The VoxLedger document dialect identifies the company by ticker and
exchange, stores the event time as epoch milliseconds (UTC), carries
speaker turns with millisecond offsets relative to the call start, and
lists the tickers mentioned during the call.
"""

from __future__ import annotations

import json
import logging
from datetime import UTC, datetime, time
from typing import TypedDict

from voxledger.diarization import diarize_call
from voxledger.normalize import extract_mentioned_tickers, normalize_ticker
from voxledger.parsing import ParsedTranscript

log = logging.getLogger(__name__)

SCHEMA_VERSION = 3


class SpeakerEntry(TypedDict):
    """One speaker in the published document."""

    speakerId: str
    name: str
    role: str
    affiliation: str


class SegmentEntry(TypedDict):
    """One merged speaker segment in the published document."""

    speakerId: str
    startMs: int
    endMs: int
    section: str
    text: str


class TranscriptDocument(TypedDict):
    """The published VoxLedger transcript document (schema version 3)."""

    callId: str
    tickerSymbol: str
    exchange: str
    companyName: str
    eventDate: int
    fiscalQuarter: str
    speakers: list[SpeakerEntry]
    segments: list[SegmentEntry]
    mentionedTickers: list[str]
    provider: str
    schemaVersion: int


def _event_ms(parsed: ParsedTranscript) -> int:
    event_dt = datetime.combine(parsed.header.event_date, time.min, tzinfo=UTC)
    return int(event_dt.timestamp() * 1000)


def build_document(parsed: ParsedTranscript) -> TranscriptDocument | None:
    """Map a parsed transcript to the published document dialect.

    Returns ``None`` when the header ticker does not normalize to a valid
    symbol; such calls cannot be keyed in the metadata store and are left
    out of the day's load.
    """
    ticker = normalize_ticker(parsed.header.ticker)
    if ticker is None:
        return None
    diarized = diarize_call(parsed)
    transcript_text = " ".join(turn.text for turn in parsed.turns)
    document: TranscriptDocument = {
        "callId": parsed.header.call_id,
        "tickerSymbol": ticker,
        "exchange": parsed.header.exchange,
        "companyName": parsed.header.company,
        "eventDate": _event_ms(parsed),
        "fiscalQuarter": parsed.header.fiscal_quarter,
        "speakers": [
            {
                "speakerId": speaker.speaker_id,
                "name": speaker.name,
                "role": speaker.role,
                "affiliation": speaker.affiliation,
            }
            for speaker in diarized.speakers
        ],
        "segments": [
            {
                "speakerId": segment.speaker_id,
                "startMs": segment.start_ms,
                "endMs": segment.end_ms,
                "section": segment.section,
                "text": segment.text,
            }
            for segment in diarized.segments
        ],
        "mentionedTickers": extract_mentioned_tickers(transcript_text),
        "provider": parsed.header.provider,
        "schemaVersion": SCHEMA_VERSION,
    }
    log.info(
        "mapped transcript %s: %d speakers, %d segments",
        document["callId"],
        len(document["speakers"]),
        len(document["segments"]),
    )
    return document


def document_to_json(document: TranscriptDocument) -> str:
    """Serialize a transcript document to its published JSON form."""
    return json.dumps(document, indent=2)
