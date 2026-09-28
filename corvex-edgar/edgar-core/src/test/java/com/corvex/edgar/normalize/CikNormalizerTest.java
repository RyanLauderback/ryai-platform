package com.corvex.edgar.normalize;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class CikNormalizerTest {

  @Test
  void padsShortCikToTenDigits() {
    assertEquals("0001045810", CikNormalizer.normalize("1045810"));
  }

  @Test
  void keepsTenDigitCikUnchanged() {
    assertEquals("0001045810", CikNormalizer.normalize("0001045810"));
  }

  @Test
  void trimsSurroundingWhitespace() {
    assertEquals("0000789019", CikNormalizer.normalize("  789019 "));
  }

  @Test
  void rejectsNonDigits() {
    assertThrows(IllegalArgumentException.class, () -> CikNormalizer.normalize("1045abc"));
  }

  @Test
  void rejectsTooLong() {
    assertThrows(IllegalArgumentException.class, () -> CikNormalizer.normalize("12345678901"));
  }

  @Test
  void rejectsNull() {
    assertThrows(IllegalArgumentException.class, () -> CikNormalizer.normalize(null));
  }
}
