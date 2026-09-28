"""SQLAlchemy 2 typed ORM models for the VoxLedger MySQL metadata store.

The schema predates the Corvex acquisition and is intentionally simple:
one row per call, one row per speaker, one row per merged segment. The
published JSON document remains the source of truth in GCS; these tables
exist for search and reporting.
"""

from __future__ import annotations

from sqlalchemy import BigInteger, ForeignKey, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Declarative base for the VoxLedger metadata schema."""


class EarningsCall(Base):
    """One earnings call, keyed by its provider call id."""

    __tablename__ = "earnings_calls"

    id: Mapped[int] = mapped_column(primary_key=True)
    call_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    ticker_symbol: Mapped[str] = mapped_column(String(12), index=True)
    exchange: Mapped[str] = mapped_column(String(16))
    company_name: Mapped[str] = mapped_column(String(128))
    event_date_ms: Mapped[int] = mapped_column(BigInteger)
    fiscal_quarter: Mapped[str] = mapped_column(String(8))
    provider: Mapped[str] = mapped_column(String(64))
    schema_version: Mapped[int]
    gcs_document_uri: Mapped[str] = mapped_column(String(512))

    speakers: Mapped[list[CallSpeaker]] = relationship(
        back_populates="call", cascade="all, delete-orphan"
    )
    segments: Mapped[list[CallSegment]] = relationship(
        back_populates="call", cascade="all, delete-orphan"
    )


class CallSpeaker(Base):
    """A diarized speaker on a call."""

    __tablename__ = "call_speakers"

    id: Mapped[int] = mapped_column(primary_key=True)
    call_id: Mapped[int] = mapped_column(ForeignKey("earnings_calls.id"))
    speaker_ref: Mapped[str] = mapped_column(String(16))
    name: Mapped[str] = mapped_column(String(128))
    role: Mapped[str] = mapped_column(String(128))
    affiliation: Mapped[str] = mapped_column(String(128))

    call: Mapped[EarningsCall] = relationship(back_populates="speakers")


class CallSegment(Base):
    """A merged speaker segment with millisecond offsets."""

    __tablename__ = "call_segments"

    id: Mapped[int] = mapped_column(primary_key=True)
    call_id: Mapped[int] = mapped_column(ForeignKey("earnings_calls.id"))
    seq: Mapped[int]
    speaker_ref: Mapped[str] = mapped_column(String(16))
    start_ms: Mapped[int]
    end_ms: Mapped[int]
    section: Mapped[str] = mapped_column(String(32))
    text: Mapped[str] = mapped_column(Text)

    call: Mapped[EarningsCall] = relationship(back_populates="segments")
