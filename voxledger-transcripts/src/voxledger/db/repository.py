"""Repository for persisting transcript documents to the MySQL metadata store."""

from __future__ import annotations

import logging
import os
from collections.abc import Mapping

from sqlalchemy import Engine, create_engine, select
from sqlalchemy.orm import Session

from voxledger.db.models import CallSegment, CallSpeaker, EarningsCall
from voxledger.mapping import TranscriptDocument

log = logging.getLogger(__name__)

MYSQL_URL_ENV = "VOXLEDGER_MYSQL_URL"
DEFAULT_MYSQL_URL = (
    "mysql+pymysql://voxledger:changeme@voxledger-mysql.internal:3306/voxledger"
)


def mysql_url(env: Mapping[str, str] | None = None) -> str:
    """Resolve the metadata store URL from the environment."""
    source = os.environ if env is None else env
    return source.get(MYSQL_URL_ENV, DEFAULT_MYSQL_URL)


class TranscriptRepository:
    """Read and write transcript metadata rows."""

    def __init__(self, engine: Engine) -> None:
        self._engine = engine

    @classmethod
    def from_env(cls, env: Mapping[str, str] | None = None) -> TranscriptRepository:
        return cls(create_engine(mysql_url(env), pool_pre_ping=True))

    def find_call_id(self, call_ref: str) -> int | None:
        """Return the internal id for a provider call id, if already loaded."""
        with Session(self._engine) as session:
            return session.scalar(
                select(EarningsCall.id).where(EarningsCall.call_id == call_ref)
            )

    def save_document(self, document: TranscriptDocument, gcs_uri: str) -> int:
        """Insert one call with its speakers and segments; returns the call id."""
        with Session(self._engine) as session, session.begin():
            call = EarningsCall(
                call_id=document["callId"],
                ticker_symbol=document["tickerSymbol"],
                exchange=document["exchange"],
                company_name=document["companyName"],
                event_date_ms=document["eventDate"],
                fiscal_quarter=document["fiscalQuarter"],
                provider=document["provider"],
                schema_version=document["schemaVersion"],
                gcs_document_uri=gcs_uri,
            )
            call.speakers = [
                CallSpeaker(
                    speaker_ref=speaker["speakerId"],
                    name=speaker["name"],
                    role=speaker["role"],
                    affiliation=speaker["affiliation"],
                )
                for speaker in document["speakers"]
            ]
            call.segments = [
                CallSegment(
                    seq=index,
                    speaker_ref=segment["speakerId"],
                    start_ms=segment["startMs"],
                    end_ms=segment["endMs"],
                    section=segment["section"],
                    text=segment["text"],
                )
                for index, segment in enumerate(document["segments"], start=1)
            ]
            session.add(call)
            session.flush()
            call_pk = call.id
        log.info("persisted call %s as id %d", document["callId"], call_pk)
        return call_pk
