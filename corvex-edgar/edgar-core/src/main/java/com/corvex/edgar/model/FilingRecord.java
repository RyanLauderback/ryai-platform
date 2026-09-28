package com.corvex.edgar.model;

import java.util.List;

/** A filing row plus its section rows: the unit the mapper emits and the loader persists. */
public class FilingRecord {

  private FilingRow filing;
  private List<FilingSectionRow> filingSection;

  public FilingRecord() {}

  public FilingRecord(FilingRow filing, List<FilingSectionRow> filingSection) {
    this.filing = filing;
    this.filingSection = filingSection;
  }

  public FilingRow getFiling() {
    return filing;
  }

  public void setFiling(FilingRow filing) {
    this.filing = filing;
  }

  public List<FilingSectionRow> getFilingSection() {
    return filingSection;
  }

  public void setFilingSection(List<FilingSectionRow> filingSection) {
    this.filingSection = filingSection;
  }
}
