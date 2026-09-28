package com.corvex.edgar.store;

import com.corvex.edgar.runs.ClaimLedger;
import com.corvex.edgar.runs.ClaimState;
import com.corvex.edgar.runs.PartitionClaim;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

/**
 * Postgres-backed {@link ClaimLedger} used by the worker fleet in production. Compiled as part of
 * the batch artifact; exercised only against the real metadata database.
 */
public class JdbcClaimLedger implements ClaimLedger {

  private static final String INSERT_CLAIM =
      "INSERT INTO run_claim (run_id, partition_key, partition_seq, status)"
          + " VALUES (?, ?, ?, 'QUEUED')";

  private static final String CLAIM_NEXT =
      "UPDATE run_claim SET status = 'CLAIMED', worker_id = ?, claimed_at = ?"
          + " WHERE run_id = ? AND partition_key = ("
          + "   SELECT partition_key FROM run_claim"
          + "   WHERE run_id = ? AND status = 'QUEUED'"
          + "   ORDER BY partition_seq LIMIT 1)"
          + " RETURNING partition_key";

  private static final String COMPLETE =
      "UPDATE run_claim SET status = 'COMPLETED', completed_at = ?"
          + " WHERE run_id = ? AND partition_key = ? AND status = 'CLAIMED'";

  private static final String RELEASE =
      "UPDATE run_claim SET status = 'QUEUED', worker_id = NULL, claimed_at = NULL"
          + " WHERE run_id = ? AND partition_key = ?";

  private static final String SELECT_FOR_RUN =
      "SELECT partition_key, worker_id, status, claimed_at FROM run_claim"
          + " WHERE run_id = ? ORDER BY partition_seq";

  private static final String SELECT_IN_STATE =
      "SELECT run_id, partition_key, worker_id, status, claimed_at FROM run_claim"
          + " WHERE status = ?";

  private final String jdbcUrl;
  private final Properties connectionProps;

  public JdbcClaimLedger(String jdbcUrl, String user, String password) {
    this.jdbcUrl = jdbcUrl;
    this.connectionProps = new Properties();
    this.connectionProps.setProperty("user", user);
    this.connectionProps.setProperty("password", password);
  }

  @Override
  public void createRun(String runId, List<String> partitionKeys) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        PreparedStatement ps = conn.prepareStatement(INSERT_CLAIM)) {
      int seq = 1;
      for (String partitionKey : partitionKeys) {
        ps.setString(1, runId);
        ps.setString(2, partitionKey);
        ps.setInt(3, seq++);
        ps.addBatch();
      }
      ps.executeBatch();
    } catch (SQLException e) {
      throw new IllegalStateException("failed to create run " + runId, e);
    }
  }

  @Override
  public Optional<PartitionClaim> claimNext(String runId, String workerId, Instant claimedAt) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        PreparedStatement ps = conn.prepareStatement(CLAIM_NEXT)) {
      ps.setString(1, workerId);
      ps.setTimestamp(2, Timestamp.from(claimedAt));
      ps.setString(3, runId);
      ps.setString(4, runId);
      try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
          return Optional.of(
              new PartitionClaim(
                  runId, rs.getString("partition_key"), workerId, ClaimState.CLAIMED, claimedAt));
        }
        return Optional.empty();
      }
    } catch (SQLException e) {
      throw new IllegalStateException("failed to claim next partition of run " + runId, e);
    }
  }

  @Override
  public void complete(String runId, String partitionKey, String workerId) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        PreparedStatement ps = conn.prepareStatement(COMPLETE)) {
      ps.setTimestamp(1, Timestamp.from(Instant.now()));
      ps.setString(2, runId);
      ps.setString(3, partitionKey);
      ps.executeUpdate();
    } catch (SQLException e) {
      throw new IllegalStateException(
          "failed to complete partition " + partitionKey + " of run " + runId, e);
    }
  }

  @Override
  public void release(String runId, String partitionKey) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        PreparedStatement ps = conn.prepareStatement(RELEASE)) {
      ps.setString(1, runId);
      ps.setString(2, partitionKey);
      ps.executeUpdate();
    } catch (SQLException e) {
      throw new IllegalStateException(
          "failed to release partition " + partitionKey + " of run " + runId, e);
    }
  }

  @Override
  public List<PartitionClaim> claimsForRun(String runId) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        PreparedStatement ps = conn.prepareStatement(SELECT_FOR_RUN)) {
      ps.setString(1, runId);
      try (ResultSet rs = ps.executeQuery()) {
        List<PartitionClaim> claims = new ArrayList<>();
        while (rs.next()) {
          claims.add(readClaim(rs, runId));
        }
        return claims;
      }
    } catch (SQLException e) {
      throw new IllegalStateException("failed to list claims of run " + runId, e);
    }
  }

  @Override
  public List<PartitionClaim> claimsInState(ClaimState state) {
    try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        PreparedStatement ps = conn.prepareStatement(SELECT_IN_STATE)) {
      ps.setString(1, state.name());
      try (ResultSet rs = ps.executeQuery()) {
        List<PartitionClaim> claims = new ArrayList<>();
        while (rs.next()) {
          claims.add(readClaim(rs, rs.getString(1)));
        }
        return claims;
      }
    } catch (SQLException e) {
      throw new IllegalStateException("failed to list claims in state " + state, e);
    }
  }

  private static PartitionClaim readClaim(ResultSet rs, String runId) throws SQLException {
    String workerId = rs.getString("worker_id");
    ClaimState state = ClaimState.valueOf(rs.getString("status"));
    Timestamp claimedAt = rs.getTimestamp("claimed_at");
    return new PartitionClaim(
        runId,
        rs.getString("partition_key"),
        workerId,
        state,
        claimedAt == null ? null : claimedAt.toInstant());
  }
}
