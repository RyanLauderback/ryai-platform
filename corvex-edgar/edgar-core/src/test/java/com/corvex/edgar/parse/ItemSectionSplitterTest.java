package com.corvex.edgar.parse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class ItemSectionSplitterTest {

  private final ItemSectionSplitter splitter = new ItemSectionSplitter();

  private static final String QUARTERLY =
      """
      <SEC-HEADER>
      ACCESSION NUMBER: 0001045810-26-000112
      </SEC-HEADER>
      <DOCUMENT>
      <TYPE>10-Q
      <TEXT>

      PART I - FINANCIAL INFORMATION

      Item 1. Financial Statements

      Condensed consolidated statements go here.

      Item 2. Management's Discussion and Analysis of Financial Condition and Results of Operations

      Revenue discussion goes here.
      It spans two paragraphs.

      PART II - OTHER INFORMATION

      Item 1A. Risk Factors

      Risk factors go here.

      </TEXT>
      </DOCUMENT>
      </SEC-DOCUMENT>
      """;

  @Test
  void splitsItemsInDocumentOrderWithPartContext() {
    List<ItemSection> sections = splitter.split(QUARTERLY);

    assertEquals(3, sections.size());

    assertEquals("PART_I_ITEM_1", sections.get(0).getSectionCode());
    assertEquals("Financial Statements", sections.get(0).getTitle());

    assertEquals("PART_I_ITEM_2", sections.get(1).getSectionCode());
    assertEquals(
        "Management's Discussion and Analysis of Financial Condition and Results of Operations",
        sections.get(1).getTitle());

    assertEquals("PART_II_ITEM_1A", sections.get(2).getSectionCode());
    assertEquals("Risk Factors", sections.get(2).getTitle());
  }

  @Test
  void sectionTextRunsFromItemHeadingToNextHeading() {
    List<ItemSection> sections = splitter.split(QUARTERLY);

    String mdAndA = sections.get(1).getText();
    assertTrue(mdAndA.startsWith("Item 2. Management's Discussion"));
    assertTrue(mdAndA.contains("Revenue discussion goes here.\nIt spans two paragraphs."));
    assertTrue(mdAndA.endsWith("It spans two paragraphs."));
  }

  @Test
  void decimalItemsWithoutPartsUseItemOnlyCodes() {
    String currentReport =
        """
        <SEC-HEADER>
        ACCESSION NUMBER: 0001318605-26-000077
        </SEC-HEADER>
        <DOCUMENT>
        <TYPE>8-K
        <TEXT>

        Item 8.01 Other Events

        The registrant announced a secondary offering.

        </TEXT>
        </DOCUMENT>
        """;

    List<ItemSection> sections = splitter.split(currentReport);

    assertEquals(1, sections.size());
    assertNull(sections.get(0).getPartRoman());
    assertEquals("ITEM_8_01", sections.get(0).getSectionCode());
    assertEquals("Other Events", sections.get(0).getTitle());
  }

  @Test
  void ignoresDocumentPreambleBeforeFirstItem() {
    List<ItemSection> sections = splitter.split(QUARTERLY);
    assertTrue(sections.get(0).getText().startsWith("Item 1."));
  }
}
