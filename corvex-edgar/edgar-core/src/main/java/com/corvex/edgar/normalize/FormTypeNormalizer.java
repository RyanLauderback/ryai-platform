package com.corvex.edgar.normalize;

import java.util.Locale;
import java.util.Map;

/**
 * Normalizes EDGAR submission types to their canonical upper-case form ("10-q" -&gt; "10-Q",
 * "8k" -&gt; "8-K"). Amendments keep their {@code /A} suffix.
 */
public final class FormTypeNormalizer {

  private static final Map<String, String> COMMON_VARIANTS =
      Map.of(
          "10Q", "10-Q",
          "10K", "10-K",
          "8K", "8-K",
          "10Q/A", "10-Q/A",
          "10K/A", "10-K/A",
          "8K/A", "8-K/A");

  private FormTypeNormalizer() {}

  public static String normalize(String rawFormType) {
    if (rawFormType == null || rawFormType.isBlank()) {
      throw new IllegalArgumentException("form type must not be blank");
    }
    String upper = rawFormType.trim().toUpperCase(Locale.ROOT);
    return COMMON_VARIANTS.getOrDefault(upper, upper);
  }
}
