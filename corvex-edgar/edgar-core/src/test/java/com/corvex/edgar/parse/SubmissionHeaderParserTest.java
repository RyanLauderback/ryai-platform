package com.corvex.edgar.parse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class SubmissionHeaderParserTest {

  private final SubmissionHeaderParser parser = new SubmissionHeaderParser();

  private static final String HEADER =
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
      \t\tCENTRAL INDEX KEY:\t\t\t0001045810
      \t\tSTANDARD INDUSTRIAL CLASSIFICATION:\tSEMICONDUCTORS [3674]
      \t\tFISCAL YEAR END:\t\t\t0126
      </SEC-HEADER>
      <DOCUMENT>
      <TYPE>10-Q
      <TEXT>
      Item 2. Management's Discussion and Analysis
      </TEXT>
      </DOCUMENT>
      </SEC-DOCUMENT>
      """;

  @Test
  void parsesHeaderFields() {
    SubmissionHeader header = parser.parse(HEADER);

    assertEquals("0001045810-26-000112", header.getAccessionNumber());
    assertEquals("10-Q", header.getFormType());
    assertEquals("20260827", header.getFiledDate());
    assertEquals("20260726", header.getPeriodOfReport());
    assertEquals("NVIDIA CORP", header.getCompanyConformedName());
    assertEquals("0001045810", header.getCik());
    assertEquals("0126", header.getFiscalYearEnd());
  }

  @Test
  void rejectsDocumentWithoutHeaderBlock() {
    assertThrows(EdgarParseException.class, () -> parser.parse("no header here"));
  }

  @Test
  void rejectsHeaderMissingAccessionNumber() {
    String broken = HEADER.replace("ACCESSION NUMBER:\t\t0001045810-26-000112\n", "");
    EdgarParseException e = assertThrows(EdgarParseException.class, () -> parser.parse(broken));
    assertEquals("missing accession number in submission header", e.getMessage());
  }

  @Test
  void rejectsBlankDocument() {
    assertThrows(EdgarParseException.class, () -> parser.parse("  "));
  }
}
