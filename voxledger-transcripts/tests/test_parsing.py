"""Tests for the provider transcript parser."""

from __future__ import annotations

from datetime import date

import pytest

from voxledger.parsing import TranscriptFormatError, parse_transcript

HEADER = """\
VOXLEDGER ASR TRANSCRIPT
PROVIDER: voxledger-asr-v3
CALL-ID: vx_acme_2026q2
COMPANY: Acme
TICKER: ACME
EXCHANGE: NASDAQ
EVENT-DATE: 2026-08-12
FISCAL-QUARTER: Q2 FY26
DURATION: 00:05:00
"""

TURNS = """\
[00:00:00] Dana Cole (Operator, VoxLedger):
Good day, and welcome to the call.

[00:00:20] Jane Doe (CEO, Acme):
Thanks for joining us today.
We have a lot to cover.

[00:01:10] John Roe (CFO, Acme):
Revenue grew 12 percent.
"""


def make_transcript(
    header: str = HEADER, turns: str = TURNS, duration: str = "00:05:00"
) -> str:
    return header.replace("DURATION: 00:05:00", f"DURATION: {duration}") + "\n" + turns


def test_parses_header_fields() -> None:
    parsed = parse_transcript(make_transcript())
    header = parsed.header
    assert header.provider == "voxledger-asr-v3"
    assert header.call_id == "vx_acme_2026q2"
    assert header.company == "Acme"
    assert header.ticker == "ACME"
    assert header.exchange == "NASDAQ"
    assert header.event_date == date(2026, 8, 12)
    assert header.fiscal_quarter == "Q2 FY26"
    assert header.duration_ms == 300000


def test_parses_turns_with_stamps_and_speakers() -> None:
    parsed = parse_transcript(make_transcript())
    assert len(parsed.turns) == 3
    first, second, third = parsed.turns
    assert first.stamp_ms == 0
    assert (first.name, first.role, first.affiliation) == (
        "Dana Cole",
        "Operator",
        "VoxLedger",
    )
    assert second.stamp_ms == 20000
    assert (second.name, second.role, second.affiliation) == ("Jane Doe", "CEO", "Acme")
    assert third.stamp_ms == 70000
    assert third.role == "CFO"


def test_turn_text_joins_multiple_lines() -> None:
    parsed = parse_transcript(make_transcript())
    assert parsed.turns[1].text == (
        "Thanks for joining us today. We have a lot to cover."
    )


def test_missing_header_field_raises() -> None:
    header = HEADER.replace("EXCHANGE: NASDAQ\n", "")
    with pytest.raises(TranscriptFormatError, match="EXCHANGE"):
        parse_transcript(make_transcript(header=header))


def test_invalid_duration_raises() -> None:
    with pytest.raises(TranscriptFormatError, match="DURATION"):
        parse_transcript(make_transcript(duration="5 minutes"))


def test_invalid_event_date_raises() -> None:
    header = HEADER.replace("EVENT-DATE: 2026-08-12", "EVENT-DATE: 08/12/2026")
    with pytest.raises(TranscriptFormatError, match="EVENT-DATE"):
        parse_transcript(make_transcript(header=header))


def test_missing_blank_line_after_header_raises() -> None:
    glued = HEADER.rstrip("\n") + "\n[00:00:00] Dana Cole (Operator, X):\nHi.\n"
    with pytest.raises(TranscriptFormatError, match="header block"):
        parse_transcript(glued)


def test_body_without_turns_raises() -> None:
    with pytest.raises(TranscriptFormatError, match="no speaker turns"):
        parse_transcript(HEADER + "\nThis call never got going.\n")


def test_first_turn_must_start_at_zero() -> None:
    turns = TURNS.replace("[00:00:00]", "[00:00:05]")
    with pytest.raises(TranscriptFormatError, match="00:00:00"):
        parse_transcript(make_transcript(turns=turns))


def test_decreasing_turn_stamps_raise() -> None:
    turns = TURNS.replace("[00:01:10]", "[00:00:10]")
    with pytest.raises(TranscriptFormatError, match="non-decreasing"):
        parse_transcript(make_transcript(turns=turns))


def test_last_turn_beyond_duration_raises() -> None:
    with pytest.raises(TranscriptFormatError, match="duration"):
        parse_transcript(make_transcript(duration="00:01:00"))


def test_turn_without_text_raises() -> None:
    turns = TURNS.replace(
        "Thanks for joining us today.\nWe have a lot to cover.\n", ""
    )
    with pytest.raises(TranscriptFormatError, match="no text"):
        parse_transcript(make_transcript(turns=turns))
