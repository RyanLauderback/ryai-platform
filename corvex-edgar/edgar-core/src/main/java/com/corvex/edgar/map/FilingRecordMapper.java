package com.corvex.edgar.map;

import com.corvex.edgar.model.FilingRecord;
import com.corvex.edgar.model.FilingRow;
import com.corvex.edgar.model.FilingSectionRow;
import com.corvex.edgar.normalize.CikNormalizer;
import com.corvex.edgar.normalize.FiscalPeriod;
import com.corvex.edgar.normalize.FiscalPeriodResolver;
import com.corvex.edgar.normalize.FormTypeNormalizer;
import com.corvex.edgar.parse.ItemSection;
import com.corvex.edgar.parse.ItemSectionSplitter;
import com.corvex.edgar.parse.SubmissionHeader;
import com.corvex.edgar.parse.SubmissionHeaderParser;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Maps a raw EDGAR full-text submission to the relational filing record: one {@link FilingRow}
 * plus one {@link FilingSectionRow} per item section. Companies are keyed by zero-padded CIK;
 * the EDGAR conformed company name is carried through unchanged.
 */
public final class FilingRecordMapper {

  private final SubmissionHeaderParser headerParser = new SubmissionHeaderParser();
  private final ItemSectionSplitter sectionSplitter = new ItemSectionSplitter();
  private final String rawBaseUri;

  /** @param rawBaseUri raw store prefix filings are loaded from, e.g. {@code s3://corvex-edgar-raw} */
  public FilingRecordMapper(String rawBaseUri) {
    this.rawBaseUri = rawBaseUri;
  }

  public FilingRecord map(String rawDocument, String ingestBatchId) {
    SubmissionHeader header = headerParser.parse(rawDocument);
    List<ItemSection> sections = sectionSplitter.split(rawDocument);

    String cik = CikNormalizer.normalize(header.getCik());
    String formType = FormTypeNormalizer.normalize(header.getFormType());
    LocalDate period = LocalDate.parse(header.getPeriodOfReport(), DateTimeFormatter.BASIC_ISO_DATE);
    LocalDate filed = LocalDate.parse(header.getFiledDate(), DateTimeFormatter.BASIC_ISO_DATE);
    FiscalPeriod fiscal = FiscalPeriodResolver.resolve(formType, period, header.getFiscalYearEnd());

    FilingRow filing = new FilingRow();
    filing.setAccessionNo(header.getAccessionNumber());
    filing.setCik(cik);
    filing.setCompanyName(header.getCompanyConformedName());
    filing.setFormType(formType);
    filing.setPeriodOfReport(period.toString());
    filing.setFiledDate(filed.toString());
    filing.setFiscalYear(fiscal.getFiscalYear());
    filing.setFiscalPeriod(fiscal.getFiscalPeriod());
    filing.setRawUri(rawUri(cik, header.getAccessionNumber()));
    filing.setIngestBatchId(ingestBatchId);

    List<FilingSectionRow> rows = new ArrayList<>(sections.size());
    for (int i = 0; i < sections.size(); i++) {
      ItemSection section = sections.get(i);
      FilingSectionRow row = new FilingSectionRow();
      row.setAccessionNo(header.getAccessionNumber());
      row.setSeq(i + 1);
      row.setSectionCode(section.getSectionCode());
      row.setSectionTitle(section.getTitle());
      row.setText(section.getText());
      row.setCharCount(section.getText().length());
      rows.add(row);
    }
    return new FilingRecord(filing, rows);
  }

  private String rawUri(String cik, String accessionNumber) {
    return rawBaseUri + "/" + cik + "/" + accessionNumber + ".txt";
  }
}
