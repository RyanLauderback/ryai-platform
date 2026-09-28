"""Diarization passes over the raw provider turns.

The provider emits one turn every time its diarizer detects a speaker change,
so a single speaker holding the floor is often split across several
consecutive turns. This module assigns stable speaker ids (``spk_0``,
``spk_1``, ... in first-appearance order), merges those consecutive
same-speaker turns into segments, and labels every segment with the call
section it belongs to: ``PREPARED_REMARKS`` up to the operator's Q&A
hand-off, and ``QA`` from the hand-off turn onward.
"""

from __future__ import annotations

import logging
import re
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Literal

from voxledger.parsing import ParsedTranscript, RawTurn

log = logging.getLogger(__name__)

Section = Literal["PREPARED_REMARKS", "QA"]
PREPARED_REMARKS: Section = "PREPARED_REMARKS"
QA: Section = "QA"

_OPERATOR_ROLE = "operator"
_QA_HANDOFF_RE = re.compile(
    r"question[s]?[- ]and[- ]answer"
    r"|q\s*&\s*a session"
    r"|open(?:ing)? (?:the )?(?:line|floor)s? (?:for|to) questions",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class Speaker:
    """A diarized speaker with a stable per-call identifier."""

    speaker_id: str
    name: str
    role: str
    affiliation: str


@dataclass(frozen=True)
class Segment:
    """A merged run of consecutive turns by one speaker in one section."""

    speaker_id: str
    start_ms: int
    end_ms: int
    section: Section
    text: str


@dataclass(frozen=True)
class DiarizedCall:
    """Speakers and merged segments for one parsed transcript."""

    speakers: list[Speaker]
    segments: list[Segment]


def assign_speakers(turns: Sequence[RawTurn]) -> list[Speaker]:
    """Assign speaker ids in first-appearance order."""
    speakers: list[Speaker] = []
    seen: dict[tuple[str, str, str], str] = {}
    for turn in turns:
        key = (turn.name, turn.role, turn.affiliation)
        if key not in seen:
            speaker_id = f"spk_{len(speakers)}"
            seen[key] = speaker_id
            speakers.append(
                Speaker(
                    speaker_id=speaker_id,
                    name=turn.name,
                    role=turn.role,
                    affiliation=turn.affiliation,
                )
            )
    return speakers


def _is_qa_handoff(turn: RawTurn) -> bool:
    return turn.role.strip().lower() == _OPERATOR_ROLE and bool(
        _QA_HANDOFF_RE.search(turn.text)
    )


def find_qa_handoff(turns: Sequence[RawTurn]) -> int:
    """Return the index of the first QA turn, or ``len(turns)`` if there is none."""
    for index, turn in enumerate(turns):
        if _is_qa_handoff(turn):
            return index
    return len(turns)


def _turn_sections(turns: Sequence[RawTurn]) -> list[Section]:
    handoff = find_qa_handoff(turns)
    return [QA if index >= handoff else PREPARED_REMARKS for index in range(len(turns))]


def _merge_turns(
    turns: Sequence[RawTurn],
    speaker_ids: Sequence[str],
    sections: Sequence[Section],
    duration_ms: int,
) -> list[Segment]:
    merged: list[Segment] = []
    for turn, speaker_id, section in zip(turns, speaker_ids, sections, strict=True):
        if (
            merged
            and merged[-1].speaker_id == speaker_id
            and merged[-1].section == section
        ):
            previous = merged[-1]
            merged[-1] = Segment(
                speaker_id=previous.speaker_id,
                start_ms=previous.start_ms,
                end_ms=previous.end_ms,
                section=previous.section,
                text=f"{previous.text} {turn.text}",
            )
        else:
            merged.append(
                Segment(
                    speaker_id=speaker_id,
                    start_ms=turn.stamp_ms,
                    end_ms=turn.stamp_ms,
                    section=section,
                    text=turn.text,
                )
            )
    segments: list[Segment] = []
    for index, segment in enumerate(merged):
        end_ms = (
            merged[index + 1].start_ms if index + 1 < len(merged) else duration_ms
        )
        segments.append(
            Segment(
                speaker_id=segment.speaker_id,
                start_ms=segment.start_ms,
                end_ms=end_ms,
                section=segment.section,
                text=segment.text,
            )
        )
    return segments


def diarize_call(parsed: ParsedTranscript) -> DiarizedCall:
    """Assign speakers, detect sections, and merge turns into segments."""
    speakers = assign_speakers(parsed.turns)
    ids_by_key = {
        (speaker.name, speaker.role, speaker.affiliation): speaker.speaker_id
        for speaker in speakers
    }
    speaker_ids = [
        ids_by_key[(turn.name, turn.role, turn.affiliation)] for turn in parsed.turns
    ]
    sections = _turn_sections(parsed.turns)
    segments = _merge_turns(
        parsed.turns, speaker_ids, sections, parsed.header.duration_ms
    )
    log.info(
        "diarized %s: %d speakers, %d segments from %d turns",
        parsed.header.call_id,
        len(speakers),
        len(segments),
        len(parsed.turns),
    )
    return DiarizedCall(speakers=speakers, segments=segments)
