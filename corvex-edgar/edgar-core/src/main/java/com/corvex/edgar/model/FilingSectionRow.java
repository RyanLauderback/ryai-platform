package com.corvex.edgar.model;

/**
 * One row of the {@code filing_section} table: a single item section of a filing. {@code seq} is
 * the 1-based position of the section in the document; {@code charCount} is the length of
 * {@code text} in characters.
 */
public class FilingSectionRow {

  private String accessionNo;
  private int seq;
  private String sectionCode;
  private String sectionTitle;
  private int charCount;
  private String text;

  public FilingSectionRow() {}

  public String getAccessionNo() {
    return accessionNo;
  }

  public void setAccessionNo(String accessionNo) {
    this.accessionNo = accessionNo;
  }

  public int getSeq() {
    return seq;
  }

  public void setSeq(int seq) {
    this.seq = seq;
  }

  public String getSectionCode() {
    return sectionCode;
  }

  public void setSectionCode(String sectionCode) {
    this.sectionCode = sectionCode;
  }

  public String getSectionTitle() {
    return sectionTitle;
  }

  public void setSectionTitle(String sectionTitle) {
    this.sectionTitle = sectionTitle;
  }

  public int getCharCount() {
    return charCount;
  }

  public void setCharCount(int charCount) {
    this.charCount = charCount;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
