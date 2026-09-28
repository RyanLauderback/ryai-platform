package com.corvex.edgar.store;

import com.corvex.edgar.model.FilingRecord;
import com.corvex.edgar.model.FilingRow;
import com.corvex.edgar.model.FilingSectionRow;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Persists filing records to the metadata Postgres. Runs on the Spark driver at the end of each
 * batch; it is never exercised outside the cluster.
 */
public class JdbcFilingRepository {

  private static final Logger LOG = LoggerFactory.getLogger(JdbcFilingRepository.class);

  private static final String INSERT_FILING =
      "INSERT INTO filing (accession_no, cik, company_name, form_type, period_of_report,"
          + " filed_date, fiscal_year, fiscal_period, raw_uri, ingest_batch_id)"
          + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          + " ON CONFLICT (accession_no) DO NOTHING";

  private static final String INSERT_SECTION =
      "INSERT INTO filing_section (accession_no, seq, section_code, section_title, char_count,"
          + " text) VALUES (?, ?, ?, ?, ?, ?)"
          + " ON CONFLICT (accession_no, seq) DO NOTHING";

  private final String jdbcUrl;
  private final Properties connectionProps;

  public JdbcFilingRepository(String jdbcUrl, String user, String password) {
    this.jdbcUrl = jdbcUrl;
    this.connectionProps = new Properties();
    this.connectionProps.setProperty("user", user);
    this.connectionProps.setProperty("password", password);
  }

  public void save(FilingRecord record) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps)) {
      conn.setAutoCommit(false);
      try {
        insertFiling(conn, record.getFiling());
        for (FilingSectionRow section : record.getFilingSection()) {
          insertSection(conn, section);
        }
        conn.commit();
      } catch (SQLException e) {
        conn.rollback();
        throw e;
      }
    } catch (SQLException e) {
      throw new IllegalStateException(
          "failed to persist filing " + record.getFiling().getAccessionNo(), e);
    }
    LOG.info("persisted filing {} with {} sections",
        record.getFiling().getAccessionNo(), record.getFilingSection().size());
  }

  private void insertFiling(Connection conn, FilingRow filing) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement(INSERT_FILING)) {
      ps.setString(1, filing.getAccessionNo());
      ps.setString(2, filing.getCik());
      ps.setString(3, filing.getCompanyName());
      ps.setString(4, filing.getFormType());
      ps.setDate(5, Date.valueOf(LocalDate.parse(filing.getPeriodOfReport())));
      ps.setDate(6, Date.valueOf(LocalDate.parse(filing.getFiledDate())));
      ps.setInt(7, filing.getFiscalYear());
      ps.setString(8, filing.getFiscalPeriod());
      ps.setString(9, filing.getRawUri());
      ps.setString(10, filing.getIngestBatchId());
      ps.executeUpdate();
    }
  }

  private void insertSection(Connection conn, FilingSectionRow section) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement(INSERT_SECTION)) {
      ps.setString(1, section.getAccessionNo());
      ps.setInt(2, section.getSeq());
      ps.setString(3, section.getSectionCode());
      ps.setString(4, section.getSectionTitle());
      ps.setInt(5, section.getCharCount());
      ps.setString(6, section.getText());
      ps.executeUpdate();
    }
  }
}
