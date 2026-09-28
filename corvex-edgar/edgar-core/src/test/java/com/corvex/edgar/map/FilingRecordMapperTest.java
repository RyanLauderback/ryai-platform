package com.corvex.edgar.map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.corvex.edgar.model.FilingRecord;
import com.corvex.edgar.model.FilingSectionRow;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import java.util.Iterator;
import org.junit.jupiter.api.Test;

class FilingRecordMapperTest {

  private final FilingRecordMapper mapper = new FilingRecordMapper("s3://corvex-edgar-raw");

  private static final String RAW =
      """
      <SEC-DOCUMENT>0001045810-26-000112.txt : 20260827
      <SEC-HEADER>0001045810-26-000112.hdr.sgml : 20260827
      ACCESSION NUMBER:\t\t0001045810-26-000112
      CONFORMED SUBMISSION TYPE:\t10-Q
      FILED AS OF DATE:\t\t20260827
      CONFORMED PERIOD OF REPORT:\t20260726

      FILER:

      \tCOMPANY DATA:
      \t\tCOMPANY CONFORMED NAME:\t\t\tNVIDIA CORP
      \t\tCENTRAL INDEX KEY:\t\t\t1045810
      \t\tFISCAL YEAR END:\t\t\t0126
      </SEC-HEADER>
      <DOCUMENT>
      <TYPE>10-Q
      <TEXT>

      PART I - FINANCIAL INFORMATION

      Item 1. Financial Statements

      Condensed consolidated statements go here.

      Item 2. Management's Discussion and Analysis of Financial Condition and Results of Operations

      Revenue discussion goes here.

      </TEXT>
      </DOCUMENT>
      </SEC-DOCUMENT>
      """;

  @Test
  void mapsHeaderIntoNormalizedFilingRow() {
    FilingRecord record = mapper.map(RAW, "edgar-20260927-01");

    assertEquals("0001045810-26-000112", record.getFiling().getAccessionNo());
    assertEquals("0001045810", record.getFiling().getCik());
    assertEquals("NVIDIA CORP", record.getFiling().getCompanyName());
    assertEquals("10-Q", record.getFiling().getFormType());
    assertEquals("2026-07-26", record.getFiling().getPeriodOfReport());
    assertEquals("2026-08-27", record.getFiling().getFiledDate());
    assertEquals(2027, record.getFiling().getFiscalYear());
    assertEquals("Q2", record.getFiling().getFiscalPeriod());
    assertEquals(
        "s3://corvex-edgar-raw/0001045810/0001045810-26-000112.txt",
        record.getFiling().getRawUri());
    assertEquals("edgar-20260927-01", record.getFiling().getIngestBatchId());
  }

  @Test
  void sectionsAreNumberedFromOneAndCarryTheirOwnCharCount() {
    FilingRecord record = mapper.map(RAW, "edgar-20260927-01");

    assertEquals(2, record.getFilingSection().size());
    int seq = 1;
    for (FilingSectionRow section : record.getFilingSection()) {
      assertEquals("0001045810-26-000112", section.getAccessionNo());
      assertEquals(seq++, section.getSeq());
      assertEquals(section.getText().length(), section.getCharCount());
    }
  }

  @Test
  void serializesToSnakeCaseWithoutTicker() {
    ObjectMapper json =
        new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

    JsonNode node = json.valueToTree(mapper.map(RAW, "edgar-20260927-01"));

    assertTrue(node.has("filing"));
    assertTrue(node.has("filing_section"));
    JsonNode filing = node.get("filing");
    assertTrue(filing.has("accession_no"));
    assertTrue(filing.has("raw_uri"));
    assertTrue(filing.has("ingest_batch_id"));
    for (Iterator<String> it = filing.fieldNames(); it.hasNext(); ) {
      assertFalse(it.next().contains("ticker"));
    }
  }
}
