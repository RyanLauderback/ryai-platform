"""Tests for speaker id assignment, turn merging, and section detection."""

from __future__ import annotations

from itertools import pairwise

from voxledger.diarization import diarize_call
from voxledger.parsing import parse_transcript

HEADER = """\
VOXLEDGER ASR TRANSCRIPT
PROVIDER: voxledger-asr-v3
CALL-ID: vx_acme_2026q2
COMPANY: Acme
TICKER: ACME
EXCHANGE: NASDAQ
EVENT-DATE: 2026-08-12
FISCAL-QUARTER: Q2 FY26
DURATION: 00:10:00
"""

CALL_WITH_QA = """\
[00:00:00] Dana Cole (Operator, VoxLedger):
Welcome to the Acme second quarter call.

[00:00:15] Jane Doe (CEO, Acme):
Thank you. It was a strong quarter.

[00:02:00] Jane Doe (CEO, Acme):
We also announced two new product lines.

[00:03:30] John Roe (CFO, Acme):
Margins expanded by 90 basis points.

[00:05:00] Dana Cole (Operator, VoxLedger):
That concludes the prepared remarks. We will now begin the
question-and-answer session.

[00:05:20] Pat Smith (Analyst, Beacon Research):
Can you talk about pricing?

[00:06:40] Jane Doe (CEO, Acme):
Pricing held firm across the portfolio.

[00:08:00] Dana Cole (Operator, VoxLedger):
That concludes today's call.
"""

CALL_WITHOUT_QA = """\
[00:00:00] Dana Cole (Operator, VoxLedger):
Welcome to the Acme business update.

[00:00:15] Jane Doe (CEO, Acme):
A short update on the quarter.

[00:02:00] John Roe (CFO, Acme):
Cash balances remain strong.
"""


def make_call(turns: str) -> str:
    return HEADER + "\n" + turns


def test_speaker_ids_follow_first_appearance_order() -> None:
    diarized = diarize_call(parse_transcript(make_call(CALL_WITH_QA)))
    assert [s.speaker_id for s in diarized.speakers] == [
        "spk_0",
        "spk_1",
        "spk_2",
        "spk_3",
    ]
    assert [s.name for s in diarized.speakers] == [
        "Dana Cole",
        "Jane Doe",
        "John Roe",
        "Pat Smith",
    ]
    assert diarized.speakers[1].role == "CEO"
    assert diarized.speakers[1].affiliation == "Acme"


def test_consecutive_same_speaker_turns_merge() -> None:
    diarized = diarize_call(parse_transcript(make_call(CALL_WITH_QA)))
    ceo_remarks = [
        s for s in diarized.segments if s.speaker_id == "spk_1" and s.start_ms == 15000
    ]
    assert len(ceo_remarks) == 1
    segment = ceo_remarks[0]
    assert segment.text == (
        "Thank you. It was a strong quarter. We also announced two new product lines."
    )
    # The merged segment ends where the next speaker starts.
    assert segment.end_ms == 210000


def test_sections_split_at_operator_handoff() -> None:
    diarized = diarize_call(parse_transcript(make_call(CALL_WITH_QA)))
    sections = [s.section for s in diarized.segments]
    assert sections == [
        "PREPARED_REMARKS",
        "PREPARED_REMARKS",
        "PREPARED_REMARKS",
        "QA",
        "QA",
        "QA",
        "QA",
    ]
    # Every PREPARED_REMARKS segment precedes every QA segment.
    assert "PREPARED_REMARKS" not in sections[sections.index("QA") :]


def test_no_handoff_means_all_prepared_remarks() -> None:
    diarized = diarize_call(parse_transcript(make_call(CALL_WITHOUT_QA)))
    assert {s.section for s in diarized.segments} == {"PREPARED_REMARKS"}


def test_segment_end_times_chain_and_last_matches_duration() -> None:
    diarized = diarize_call(parse_transcript(make_call(CALL_WITH_QA)))
    segments = diarized.segments
    assert segments[0].start_ms == 0
    for current, following in pairwise(segments):
        assert current.end_ms == following.start_ms
    assert segments[-1].end_ms == 600000


def test_open_the_lines_phrase_also_marks_handoff() -> None:
    turns = CALL_WITH_QA.replace(
        "That concludes the prepared remarks. We will now begin the\n"
        "question-and-answer session.",
        "We will now open the lines for questions.",
    )
    diarized = diarize_call(parse_transcript(make_call(turns)))
    sections = {s.section for s in diarized.segments}
    assert sections == {"PREPARED_REMARKS", "QA"}
