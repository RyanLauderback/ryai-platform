"""Parser for VoxLedger ASR provider transcript files.

A provider transcript is a plain-text file with a ``KEY: value`` header block
terminated by a blank line, followed by diarized speaker turns. Each turn
starts with a header line of the form::

    [HH:MM:SS] Jane Doe (CEO, Acme Corp):

and the spoken text follows on the subsequent lines until the next turn
header or the end of the file. Timestamps are relative to the start of the
call, so the first turn always starts at ``00:00:00``.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from datetime import date
from itertools import pairwise

log = logging.getLogger(__name__)

_TURN_RE = re.compile(
    r"^\[(\d{2}):(\d{2}):(\d{2})\] ([^()]+?) \(([^,()]+), ([^()]+)\):[ \t]*$",
    re.MULTILINE,
)
_HEADER_LINE_RE = re.compile(r"^([A-Z][A-Z-]*):[ \t]*(\S.*?)[ \t]*$")
_DURATION_RE = re.compile(r"^(\d{2}):(\d{2}):(\d{2})$")

_REQUIRED_HEADER_KEYS = (
    "PROVIDER",
    "CALL-ID",
    "COMPANY",
    "TICKER",
    "EXCHANGE",
    "EVENT-DATE",
    "FISCAL-QUARTER",
    "DURATION",
)


class TranscriptFormatError(ValueError):
    """Raised when a provider transcript does not match the expected layout."""


@dataclass(frozen=True)
class TranscriptHeader:
    """Metadata from the header block of a provider transcript."""

    provider: str
    call_id: str
    company: str
    ticker: str
    exchange: str
    event_date: date
    fiscal_quarter: str
    duration_ms: int


@dataclass(frozen=True)
class RawTurn:
    """One diarized speaker turn exactly as delivered by the provider."""

    stamp_ms: int
    name: str
    role: str
    affiliation: str
    text: str


@dataclass(frozen=True)
class ParsedTranscript:
    """A fully parsed provider transcript."""

    header: TranscriptHeader
    turns: list[RawTurn]


def _clock_to_ms(hours: str, minutes: str, seconds: str) -> int:
    return (int(hours) * 3600 + int(minutes) * 60 + int(seconds)) * 1000


def _parse_header(block: str) -> TranscriptHeader:
    fields: dict[str, str] = {}
    for line in block.splitlines():
        match = _HEADER_LINE_RE.match(line)
        if match is not None:
            fields[match.group(1)] = match.group(2)
    missing = [key for key in _REQUIRED_HEADER_KEYS if key not in fields]
    if missing:
        raise TranscriptFormatError(f"missing header fields: {', '.join(missing)}")

    duration_match = _DURATION_RE.match(fields["DURATION"])
    if duration_match is None:
        raise TranscriptFormatError(f"invalid DURATION header: {fields['DURATION']!r}")
    duration_ms = _clock_to_ms(
        duration_match.group(1), duration_match.group(2), duration_match.group(3)
    )

    try:
        event_date = date.fromisoformat(fields["EVENT-DATE"])
    except ValueError as exc:
        raise TranscriptFormatError(
            f"invalid EVENT-DATE header: {fields['EVENT-DATE']!r}"
        ) from exc

    return TranscriptHeader(
        provider=fields["PROVIDER"],
        call_id=fields["CALL-ID"],
        company=fields["COMPANY"],
        ticker=fields["TICKER"],
        exchange=fields["EXCHANGE"],
        event_date=event_date,
        fiscal_quarter=fields["FISCAL-QUARTER"],
        duration_ms=duration_ms,
    )


def _parse_turns(body: str, duration_ms: int) -> list[RawTurn]:
    matches = list(_TURN_RE.finditer(body))
    if not matches:
        raise TranscriptFormatError("transcript body has no speaker turns")

    turns: list[RawTurn] = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        lines = body[match.end() : end].splitlines()
        spoken = " ".join(line.strip() for line in lines if line.strip())
        if not spoken:
            raise TranscriptFormatError(f"turn at {match.group(0)!r} has no text")
        turns.append(
            RawTurn(
                stamp_ms=_clock_to_ms(*match.group(1, 2, 3)),
                name=match.group(4).strip(),
                role=match.group(5).strip(),
                affiliation=match.group(6).strip(),
                text=spoken,
            )
        )

    if turns[0].stamp_ms != 0:
        raise TranscriptFormatError("first turn must start at 00:00:00")
    for previous, current in pairwise(turns):
        if current.stamp_ms < previous.stamp_ms:
            raise TranscriptFormatError("turn timestamps must be non-decreasing")
    if turns[-1].stamp_ms >= duration_ms:
        raise TranscriptFormatError("last turn starts after the declared call duration")
    return turns


def parse_transcript(text: str) -> ParsedTranscript:
    """Parse a provider transcript file into a header and speaker turns."""
    header_block, separator, body = text.partition("\n\n")
    if not separator:
        raise TranscriptFormatError("transcript has no header block")
    header = _parse_header(header_block)
    turns = _parse_turns(body, header.duration_ms)
    log.info(
        "parsed transcript %s: %d turns, duration %d ms",
        header.call_id,
        len(turns),
        header.duration_ms,
    )
    return ParsedTranscript(header=header, turns=turns)
