package com.corvex.edgar.parse;

/**
 * Fields lifted from the {@code <SEC-HEADER>} block of a full-text submission. Dates are kept in
 * the raw EDGAR {@code yyyyMMdd} form; normalization happens downstream.
 */
public final class SubmissionHeader {

  private final String accessionNumber;
  private final String formType;
  private final String filedDate;
  private final String periodOfReport;
  private final String companyConformedName;
  private final String cik;
  private final String fiscalYearEnd;

  public SubmissionHeader(
      String accessionNumber,
      String formType,
      String filedDate,
      String periodOfReport,
      String companyConformedName,
      String cik,
      String fiscalYearEnd) {
    this.accessionNumber = accessionNumber;
    this.formType = formType;
    this.filedDate = filedDate;
    this.periodOfReport = periodOfReport;
    this.companyConformedName = companyConformedName;
    this.cik = cik;
    this.fiscalYearEnd = fiscalYearEnd;
  }

  public String getAccessionNumber() {
    return accessionNumber;
  }

  public String getFormType() {
    return formType;
  }

  /** Filing date, raw {@code yyyyMMdd}. */
  public String getFiledDate() {
    return filedDate;
  }

  /** Period of report, raw {@code yyyyMMdd}. */
  public String getPeriodOfReport() {
    return periodOfReport;
  }

  public String getCompanyConformedName() {
    return companyConformedName;
  }

  /** Central index key as found in the header, not yet zero-padded. */
  public String getCik() {
    return cik;
  }

  /** Fiscal year end as {@code MMDD}, e.g. {@code 0126}. */
  public String getFiscalYearEnd() {
    return fiscalYearEnd;
  }
}
