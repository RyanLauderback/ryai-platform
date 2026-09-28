"""Ticker symbol normalization.

Provider feeds spell tickers inconsistently (lower case, extra whitespace,
exchange suffixes such as ``brk.b``). These helpers normalize them to the
canonical upper-case form used across the VoxLedger metadata store, and
extract tickers mentioned in transcript text, either in ``$TICKER`` form or
in the provider's ``(EXCHANGE: TICKER)`` parenthetical form.

Anything that does not match the canonical ticker shape is rejected by
returning ``None`` (or, for mentions, by leaving it out of the result), so
callers never have to handle malformed symbols downstream.
"""

from __future__ import annotations

import logging
import re

log = logging.getLogger(__name__)

_TICKER_RE = re.compile(r"[A-Z][A-Z0-9.\-]{0,9}")
_MENTION_RE = re.compile(
    r"\$([A-Z][A-Z0-9.\-]{0,9})\b"
    r"|\((?:NASDAQ|NYSE):\s*([A-Z][A-Z0-9.\-]{0,9})\)"
)


def normalize_ticker(raw: str) -> str | None:
    """Normalize a raw ticker string, or return ``None`` if it is not a ticker."""
    candidate = raw.strip().upper()
    if not candidate:
        return None
    if _TICKER_RE.fullmatch(candidate) is None:
        log.debug("rejected malformed ticker %r", raw)
        return None
    return candidate


def extract_mentioned_tickers(text: str) -> list[str]:
    """Extract normalized tickers mentioned in text, de-duplicated in order."""
    seen: set[str] = set()
    tickers: list[str] = []
    for match in _MENTION_RE.finditer(text):
        mention = match.group(1) if match.group(1) is not None else match.group(2)
        ticker = normalize_ticker(mention)
        if ticker is not None and ticker not in seen:
            seen.add(ticker)
            tickers.append(ticker)
    return tickers
