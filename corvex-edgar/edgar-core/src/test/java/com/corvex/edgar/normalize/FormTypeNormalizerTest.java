package com.corvex.edgar.normalize;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class FormTypeNormalizerTest {

  @Test
  void upperCasesCanonicalForms() {
    assertEquals("10-Q", FormTypeNormalizer.normalize("10-q"));
    assertEquals("8-K", FormTypeNormalizer.normalize("8-k"));
  }

  @Test
  void insertsMissingDash() {
    assertEquals("10-Q", FormTypeNormalizer.normalize("10Q"));
    assertEquals("10-K", FormTypeNormalizer.normalize("10k"));
    assertEquals("8-K", FormTypeNormalizer.normalize("8K"));
  }

  @Test
  void keepsAmendmentSuffix() {
    assertEquals("10-K/A", FormTypeNormalizer.normalize("10-K/A"));
    assertEquals("10-Q/A", FormTypeNormalizer.normalize("10q/a"));
  }

  @Test
  void passesThroughUnknownFormsUppercased() {
    assertEquals("S-1", FormTypeNormalizer.normalize("s-1"));
  }

  @Test
  void rejectsBlank() {
    assertThrows(IllegalArgumentException.class, () -> FormTypeNormalizer.normalize("  "));
  }
}
