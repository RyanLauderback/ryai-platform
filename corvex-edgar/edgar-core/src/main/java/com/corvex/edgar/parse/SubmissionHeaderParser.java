package com.corvex.edgar.parse;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Parses the {@code <SEC-HEADER>} block of an EDGAR full-text submission into a
 * {@link SubmissionHeader}. Only the fields the pipeline needs are extracted; everything else in
 * the header is passed through untouched in the raw store.
 */
public final class SubmissionHeaderParser {

  private static final Pattern HEADER_BLOCK =
      Pattern.compile("<SEC-HEADER>.*?</SEC-HEADER>", Pattern.DOTALL);

  private static final Pattern ACCESSION = Pattern.compile("(?m)^ACCESSION NUMBER:\\s*(\\S+)");
  private static final Pattern FORM_TYPE =
      Pattern.compile("(?m)^CONFORMED SUBMISSION TYPE:\\s*(\\S+)");
  private static final Pattern FILED_DATE = Pattern.compile("(?m)^FILED AS OF DATE:\\s*(\\d{8})");
  private static final Pattern PERIOD_OF_REPORT =
      Pattern.compile("(?m)^CONFORMED PERIOD OF REPORT:\\s*(\\d{8})");
  private static final Pattern CONFORMED_NAME =
      Pattern.compile("(?m)^\\s*COMPANY CONFORMED NAME:\\s*(.+?)\\s*$");
  private static final Pattern CIK = Pattern.compile("(?m)^\\s*CENTRAL INDEX KEY:\\s*(\\d+)");
  private static final Pattern FISCAL_YEAR_END =
      Pattern.compile("(?m)^\\s*FISCAL YEAR END:\\s*(\\d{4})");

  public SubmissionHeader parse(String rawDocument) {
    if (rawDocument == null || rawDocument.isBlank()) {
      throw new EdgarParseException("empty submission document");
    }
    Matcher block = HEADER_BLOCK.matcher(rawDocument);
    if (!block.find()) {
      throw new EdgarParseException("no <SEC-HEADER> block found");
    }
    String header = block.group();
    return new SubmissionHeader(
        required(header, ACCESSION, "accession number"),
        required(header, FORM_TYPE, "submission type"),
        required(header, FILED_DATE, "filed date"),
        required(header, PERIOD_OF_REPORT, "period of report"),
        required(header, CONFORMED_NAME, "company conformed name"),
        required(header, CIK, "central index key"),
        required(header, FISCAL_YEAR_END, "fiscal year end"));
  }

  private static String required(String header, Pattern pattern, String label) {
    Matcher m = pattern.matcher(header);
    if (!m.find()) {
      throw new EdgarParseException("missing " + label + " in submission header");
    }
    return m.group(1);
  }
}
