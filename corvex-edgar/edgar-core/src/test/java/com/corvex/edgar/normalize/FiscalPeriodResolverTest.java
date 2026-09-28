package com.corvex.edgar.normalize;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class FiscalPeriodResolverTest {

  @Test
  void quarterlyPeriodForJanuaryFiscalYearEnd() {
    // Fiscal year ends late January: 2026-07-26 sits in the second quarter of fiscal 2027.
    FiscalPeriod fiscal =
        FiscalPeriodResolver.resolve("10-Q", LocalDate.parse("2026-07-26"), "0126");
    assertEquals(2027, fiscal.getFiscalYear());
    assertEquals("Q2", fiscal.getFiscalPeriod());
  }

  @Test
  void quarterlyPeriodForCalendarFiscalYear() {
    FiscalPeriod fiscal =
        FiscalPeriodResolver.resolve("10-Q", LocalDate.parse("2026-06-30"), "1231");
    assertEquals(2026, fiscal.getFiscalYear());
    assertEquals("Q2", fiscal.getFiscalPeriod());
  }

  @Test
  void annualReportMapsToFy() {
    // Fiscal year ends June 30: the annual report for the year ended 2026-06-30 is fiscal 2026.
    FiscalPeriod fiscal =
        FiscalPeriodResolver.resolve("10-K", LocalDate.parse("2026-06-30"), "0630");
    assertEquals(2026, fiscal.getFiscalYear());
    assertEquals("FY", fiscal.getFiscalPeriod());
  }

  @Test
  void currentReportUsesTheCoveringQuarter() {
    FiscalPeriod fiscal =
        FiscalPeriodResolver.resolve("8-K", LocalDate.parse("2026-09-15"), "1231");
    assertEquals(2026, fiscal.getFiscalYear());
    assertEquals("Q3", fiscal.getFiscalPeriod());
  }

  @Test
  void fourthQuarterBeforeCalendarFiscalYearEnd() {
    FiscalPeriod fiscal =
        FiscalPeriodResolver.resolve("10-Q", LocalDate.parse("2026-10-31"), "1231");
    assertEquals(2026, fiscal.getFiscalYear());
    assertEquals("Q4", fiscal.getFiscalPeriod());
  }
}
