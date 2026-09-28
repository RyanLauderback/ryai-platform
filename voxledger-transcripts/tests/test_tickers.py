"""Tests for ticker normalization and mention extraction."""

from __future__ import annotations

from voxledger.normalize import extract_mentioned_tickers, normalize_ticker


class TestNormalizeTicker:
    def test_strips_whitespace_and_uppercases(self) -> None:
        assert normalize_ticker(" nvda ") == "NVDA"

    def test_keeps_dot_suffix(self) -> None:
        assert normalize_ticker("brk.b") == "BRK.B"

    def test_keeps_hyphen(self) -> None:
        assert normalize_ticker("abc-def") == "ABC-DEF"

    def test_single_letter(self) -> None:
        assert normalize_ticker("f") == "F"

    def test_numeric_string_rejected(self) -> None:
        assert normalize_ticker("123") is None

    def test_leading_digit_rejected(self) -> None:
        assert normalize_ticker("9abc") is None

    def test_empty_string_rejected(self) -> None:
        assert normalize_ticker("   ") is None

    def test_too_long_rejected(self) -> None:
        assert normalize_ticker("ABCDEFGHIJK") is None

    def test_embedded_space_rejected(self) -> None:
        assert normalize_ticker("AB C") is None


class TestExtractMentionedTickers:
    def test_finds_cashtag_and_exchange_styles_in_order(self) -> None:
        text = "Peers $TSLA and (NASDAQ: NVDA) grew; $TSLA again"
        assert extract_mentioned_tickers(text) == ["TSLA", "NVDA"]

    def test_no_mentions(self) -> None:
        assert extract_mentioned_tickers("No symbols discussed here.") == []

    def test_dollar_amounts_are_not_tickers(self) -> None:
        assert extract_mentioned_tickers("Revenue was $45.2 billion.") == []

    def test_nyse_parenthetical(self) -> None:
        assert extract_mentioned_tickers("Financing led by (NYSE: JPM).") == ["JPM"]

    def test_lowercase_cashtags_not_captured(self) -> None:
        assert extract_mentioned_tickers("watching $tsla today") == []
