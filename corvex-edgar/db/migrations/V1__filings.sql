-- Core filing metadata, one row per EDGAR submission.
CREATE TABLE filing (
    accession_no    VARCHAR(20)  NOT NULL PRIMARY KEY,
    cik             CHAR(10)     NOT NULL,
    company_name    TEXT         NOT NULL,
    form_type       VARCHAR(10)  NOT NULL,
    period_of_report DATE,
    filed_date      DATE         NOT NULL,
    fiscal_year     INTEGER,
    fiscal_period   VARCHAR(2),
    raw_uri         TEXT         NOT NULL,
    ingest_batch_id VARCHAR(32)  NOT NULL,
    ingested_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_filing_cik ON filing (cik);
CREATE INDEX idx_filing_filed_date ON filing (filed_date);
CREATE INDEX idx_filing_ingest_batch ON filing (ingest_batch_id);
