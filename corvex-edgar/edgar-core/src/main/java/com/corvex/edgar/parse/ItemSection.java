package com.corvex.edgar.parse;

/**
 * One {@code Item} section cut out of a submission body, in document order. {@code partRoman} is
 * the enclosing {@code PART} heading ("I", "II", ...) or {@code null} for forms without parts.
 */
public final class ItemSection {

  private final String partRoman;
  private final String itemNumber;
  private final String title;
  private final String text;

  public ItemSection(String partRoman, String itemNumber, String title, String text) {
    this.partRoman = partRoman;
    this.itemNumber = itemNumber;
    this.title = title;
    this.text = text;
  }

  public String getPartRoman() {
    return partRoman;
  }

  public String getItemNumber() {
    return itemNumber;
  }

  public String getTitle() {
    return title;
  }

  /** Full section text including the {@code Item} heading line, trailing whitespace trimmed. */
  public String getText() {
    return text;
  }

  /** Durable section code, e.g. {@code PART_I_ITEM_2} or {@code ITEM_8_01}. */
  public String getSectionCode() {
    String item = itemNumber.replace('.', '_');
    return partRoman == null ? "ITEM_" + item : "PART_" + partRoman + "_ITEM_" + item;
  }
}
