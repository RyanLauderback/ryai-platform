package com.corvex.edgar.normalize;

/**
 * Normalizes a Central Index Key to the canonical ten-digit, zero-padded form used as the company
 * key across the filings tables ("1045810" -&gt; "0001045810").
 */
public final class CikNormalizer {

  private static final int CIK_WIDTH = 10;

  private CikNormalizer() {}

  public static String normalize(String rawCik) {
    if (rawCik == null) {
      throw new IllegalArgumentException("cik must not be null");
    }
    String digits = rawCik.trim();
    if (!digits.matches("\\d{1,10}")) {
      throw new IllegalArgumentException("not a valid cik: '" + rawCik + "'");
    }
    StringBuilder padded = new StringBuilder(CIK_WIDTH);
    for (int i = digits.length(); i < CIK_WIDTH; i++) {
      padded.append('0');
    }
    return padded.append(digits).toString();
  }
}
