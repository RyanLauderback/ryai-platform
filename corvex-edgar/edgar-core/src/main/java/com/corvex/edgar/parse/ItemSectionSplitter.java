package com.corvex.edgar.parse;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Splits the body of a full-text submission (everything after {@code </SEC-HEADER>}) into item
 * sections. Section boundaries are the {@code Item N.} / {@code Item N.NN} heading lines;
 * {@code PART I}, {@code PART II}, ... headings set the part context for the section code.
 */
public final class ItemSectionSplitter {

  private static final Pattern PART_HEADING = Pattern.compile("^PART\\s+(I|II|III|IV)\\b.*");
  private static final Pattern ITEM_HEADING =
      Pattern.compile("^Item\\s+(\\d+[A-Z]?(?:\\.\\d+)?)[.:]?\\s+(.+?)\\s*");

  public List<ItemSection> split(String rawDocument) {
    String body = bodyOf(rawDocument);
    List<ItemSection> sections = new ArrayList<>();
    String partRoman = null;
    String currentItem = null;
    String currentTitle = null;
    String currentPart = null;
    StringBuilder currentText = null;

    for (String line : body.split("\n", -1)) {
      String trimmed = line.trim();
      if (trimmed.startsWith("</TEXT>")) {
        break;
      }
      Matcher part = PART_HEADING.matcher(trimmed);
      Matcher item = ITEM_HEADING.matcher(trimmed);
      if (item.matches()) {
        if (currentText != null) {
          sections.add(new ItemSection(currentPart, currentItem, currentTitle, flush(currentText)));
        }
        currentPart = partRoman;
        currentItem = item.group(1);
        currentTitle = item.group(2);
        currentText = new StringBuilder(trimmed);
      } else if (part.matches()) {
        if (currentText != null) {
          sections.add(new ItemSection(currentPart, currentItem, currentTitle, flush(currentText)));
          currentText = null;
          currentItem = null;
          currentTitle = null;
        }
        partRoman = part.group(1);
      } else if (currentText != null) {
        currentText.append('\n').append(line);
      }
    }
    if (currentText != null) {
      sections.add(new ItemSection(currentPart, currentItem, currentTitle, flush(currentText)));
    }
    return sections;
  }

  private static String bodyOf(String rawDocument) {
    if (rawDocument == null) {
      throw new EdgarParseException("empty submission document");
    }
    int headerEnd = rawDocument.indexOf("</SEC-HEADER>");
    return headerEnd < 0 ? rawDocument : rawDocument.substring(headerEnd + "</SEC-HEADER>".length());
  }

  private static String flush(StringBuilder text) {
    return text.toString().replaceAll("\\s+$", "");
  }
}
