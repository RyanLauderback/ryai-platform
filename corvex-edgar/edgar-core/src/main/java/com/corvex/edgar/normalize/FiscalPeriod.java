package com.corvex.edgar.normalize;

/** Fiscal year and period ("Q1".."Q4" or "FY") that a filing's period of report belongs to. */
public final class FiscalPeriod {

  private final int fiscalYear;
  private final String fiscalPeriod;

  public FiscalPeriod(int fiscalYear, String fiscalPeriod) {
    this.fiscalYear = fiscalYear;
    this.fiscalPeriod = fiscalPeriod;
  }

  public int getFiscalYear() {
    return fiscalYear;
  }

  public String getFiscalPeriod() {
    return fiscalPeriod;
  }
}
