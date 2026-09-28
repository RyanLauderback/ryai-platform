-- Item sections cut out of each filing, in document order.
CREATE TABLE filing_section (
    accession_no  VARCHAR(20) NOT NULL REFERENCES filing (accession_no),
    seq           INTEGER     NOT NULL,
    section_code  VARCHAR(32) NOT NULL,
    section_title TEXT        NOT NULL,
    char_count    INTEGER     NOT NULL,
    text          TEXT        NOT NULL,
    PRIMARY KEY (accession_no, seq)
);

CREATE INDEX idx_filing_section_code ON filing_section (section_code);
