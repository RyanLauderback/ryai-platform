"""Golden-file tests: every raw sample maps to its committed golden document.

Comparison is semantic (parsed JSON structures), never byte-wise, so
formatting changes from the repo's pre-commit hooks cannot break the tests.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from voxledger.mapping import build_document
from voxledger.parsing import parse_transcript

SAMPLES_RAW = Path(__file__).resolve().parent.parent / "samples" / "raw"
SAMPLES_GOLDEN = Path(__file__).resolve().parent.parent / "samples" / "golden"


def _sample_paths() -> list[Path]:
    return sorted(SAMPLES_RAW.glob("*.txt"))


def _sample_id(path: Path) -> str:
    return path.stem


@pytest.mark.parametrize("raw_path", _sample_paths(), ids=_sample_id)
def test_golden_output_matches(raw_path: Path) -> None:
    parsed = parse_transcript(raw_path.read_text(encoding="utf-8"))
    document = build_document(parsed)
    assert document is not None, f"{raw_path.name} did not produce a document"
    golden_path = SAMPLES_GOLDEN / f"{raw_path.stem}.json"
    golden = json.loads(golden_path.read_text(encoding="utf-8"))
    assert document == golden


def test_raw_and_golden_sample_sets_match() -> None:
    raw_stems = {path.stem for path in SAMPLES_RAW.glob("*.txt")}
    golden_stems = {path.stem for path in SAMPLES_GOLDEN.glob("*.json")}
    assert raw_stems == golden_stems
