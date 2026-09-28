"""Tests for mapping parsed transcripts to the published document dialect."""

from __future__ import annotations

from datetime import UTC, datetime
from itertools import pairwise

from voxledger.mapping import SCHEMA_VERSION, build_document, document_to_json
from voxledger.parsing import parse_transcript

HEADER = """\
VOXLEDGER ASR TRANSCRIPT
PROVIDER: voxledger-asr-v3
CALL-ID: vx_acme_2026q2
COMPANY: Acme
TICKER: acme
EXCHANGE: NASDAQ
EVENT-DATE: 2026-08-12
FISCAL-QUARTER: Q2 FY26
DURATION: 00:05:00
"""

TURNS = """\
[00:00:00] Dana Cole (Operator, VoxLedger):
Welcome to the Acme call.

[00:00:20] Jane Doe (CEO, Acme):
Demand from $TSLA and (NYSE: JPM) stayed strong.

[00:01:00] Dana Cole (Operator, VoxLedger):
That concludes the prepared remarks. We will now begin the
question-and-answer session.

[00:01:30] Jane Doe (CEO, Acme):
Happy to take questions.

[00:04:00] Dana Cole (Operator, VoxLedger):
That concludes today's call.
"""


def test_document_follows_the_dialect() -> None:
    document = build_document(parse_transcript(HEADER + "\n" + TURNS))
    assert document is not None
    assert document["callId"] == "vx_acme_2026q2"
    assert document["tickerSymbol"] == "ACME"
    assert document["exchange"] == "NASDAQ"
    assert document["companyName"] == "Acme"
    assert document["provider"] == "voxledger-asr-v3"
    assert document["schemaVersion"] == SCHEMA_VERSION
    assert document["fiscalQuarter"] == "Q2 FY26"


def test_event_date_is_epoch_milliseconds_utc() -> None:
    document = build_document(parse_transcript(HEADER + "\n" + TURNS))
    assert document is not None
    expected = int(datetime(2026, 8, 12, tzinfo=UTC).timestamp() * 1000)
    assert document["eventDate"] == expected


def test_mentioned_tickers_come_from_turn_text() -> None:
    document = build_document(parse_transcript(HEADER + "\n" + TURNS))
    assert document is not None
    assert document["mentionedTickers"] == ["TSLA", "JPM"]


def test_segment_offsets_chain_to_duration() -> None:
    document = build_document(parse_transcript(HEADER + "\n" + TURNS))
    assert document is not None
    segments = document["segments"]
    assert segments[0]["startMs"] == 0
    for current, following in pairwise(segments):
        assert current["endMs"] == following["startMs"]
    assert segments[-1]["endMs"] == 300000
    assert {s["section"] for s in segments} == {"PREPARED_REMARKS", "QA"}


def test_unusable_header_ticker_drops_the_call() -> None:
    header = HEADER.replace("TICKER: acme", "TICKER: 123")
    assert build_document(parse_transcript(header + "\n" + TURNS)) is None


def test_document_serializes_to_json() -> None:
    document = build_document(parse_transcript(HEADER + "\n" + TURNS))
    assert document is not None
    assert '"schemaVersion": 3' in document_to_json(document)
