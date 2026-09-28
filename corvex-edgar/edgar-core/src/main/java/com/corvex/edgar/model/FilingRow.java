package com.corvex.edgar.model;

/**
 * One row of the {@code filing} table. Dates are ISO {@code yyyy-MM-dd} strings; the class is a
 * plain bean so Jackson serializes it directly in the snake_case wire dialect.
 */
public class FilingRow {

  private String accessionNo;
  private String cik;
  private String companyName;
  private String formType;
  private String periodOfReport;
  private String filedDate;
  private Integer fiscalYear;
  private String fiscalPeriod;
  private String rawUri;
  private String ingestBatchId;

  public FilingRow() {}

  public String getAccessionNo() {
    return accessionNo;
  }

  public void setAccessionNo(String accessionNo) {
    this.accessionNo = accessionNo;
  }

  public String getCik() {
    return cik;
  }

  public void setCik(String cik) {
    this.cik = cik;
  }

  public String getCompanyName() {
    return companyName;
  }

  public void setCompanyName(String companyName) {
    this.companyName = companyName;
  }

  public String getFormType() {
    return formType;
  }

  public void setFormType(String formType) {
    this.formType = formType;
  }

  public String getPeriodOfReport() {
    return periodOfReport;
  }

  public void setPeriodOfReport(String periodOfReport) {
    this.periodOfReport = periodOfReport;
  }

  public String getFiledDate() {
    return filedDate;
  }

  public void setFiledDate(String filedDate) {
    this.filedDate = filedDate;
  }

  public Integer getFiscalYear() {
    return fiscalYear;
  }

  public void setFiscalYear(Integer fiscalYear) {
    this.fiscalYear = fiscalYear;
  }

  public String getFiscalPeriod() {
    return fiscalPeriod;
  }

  public void setFiscalPeriod(String fiscalPeriod) {
    this.fiscalPeriod = fiscalPeriod;
  }

  public String getRawUri() {
    return rawUri;
  }

  public void setRawUri(String rawUri) {
    this.rawUri = rawUri;
  }

  public String getIngestBatchId() {
    return ingestBatchId;
  }

  public void setIngestBatchId(String ingestBatchId) {
    this.ingestBatchId = ingestBatchId;
  }
}
