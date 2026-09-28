package com.corvex.edgar.normalize;

import java.time.LocalDate;
import java.time.MonthDay;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * Resolves the fiscal year and period for a filing from its form type, period of report, and the
 * registrant's fiscal year end. Annual reports (10-K) map to {@code FY}; other forms map to the
 * fiscal quarter containing the period end.
 */
public final class FiscalPeriodResolver {

  private static final DateTimeFormatter MONTH_DAY = DateTimeFormatter.ofPattern("MMdd");

  private FiscalPeriodResolver() {}

  /**
   * @param formType normalized form type, e.g. {@code 10-Q}
   * @param periodOfReport period of report date
   * @param fiscalYearEnd fiscal year end as {@code MMDD}, e.g. {@code 0126}
   */
  public static FiscalPeriod resolve(
      String formType, LocalDate periodOfReport, String fiscalYearEnd) {
    MonthDay fye = MonthDay.parse(fiscalYearEnd, MONTH_DAY);
    LocalDate fyeInPeriodYear = fye.atYear(periodOfReport.getYear());
    int fiscalYear =
        periodOfReport.isAfter(fyeInPeriodYear)
            ? periodOfReport.getYear() + 1
            : periodOfReport.getYear();
    if ("10-K".equals(formType) || "10-K/A".equals(formType)) {
      return new FiscalPeriod(fiscalYear, "FY");
    }
    LocalDate fiscalYearStart = fye.atYear(fiscalYear - 1).plusDays(1);
    long monthsElapsed = ChronoUnit.MONTHS.between(fiscalYearStart, periodOfReport);
    int quarter = (int) (monthsElapsed / 3) + 1;
    if (quarter < 1) {
      quarter = 1;
    } else if (quarter > 4) {
      quarter = 4;
    }
    return new FiscalPeriod(fiscalYear, "Q" + quarter);
  }
}
