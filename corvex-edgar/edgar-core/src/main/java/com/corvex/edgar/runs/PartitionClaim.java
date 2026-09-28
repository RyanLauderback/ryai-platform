package com.corvex.edgar.runs;

import java.time.Instant;

/** The assignment state of one partition of a run. */
public final class PartitionClaim {

  private final String runId;
  private final String partitionKey;
  private String workerId;
  private ClaimState state;
  private Instant claimedAt;

  public PartitionClaim(String runId, String partitionKey) {
    this.runId = runId;
    this.partitionKey = partitionKey;
    this.state = ClaimState.QUEUED;
  }

  /** Hydrates a claim from a backing store row. */
  public PartitionClaim(
      String runId, String partitionKey, String workerId, ClaimState state, Instant claimedAt) {
    this.runId = runId;
    this.partitionKey = partitionKey;
    this.workerId = workerId;
    this.state = state;
    this.claimedAt = claimedAt;
  }

  PartitionClaim(PartitionClaim other) {
    this.runId = other.runId;
    this.partitionKey = other.partitionKey;
    this.workerId = other.workerId;
    this.state = other.state;
    this.claimedAt = other.claimedAt;
  }

  public String getRunId() {
    return runId;
  }

  public String getPartitionKey() {
    return partitionKey;
  }

  /** The worker holding the claim, or {@code null} while the partition is queued. */
  public String getWorkerId() {
    return workerId;
  }

  public ClaimState getState() {
    return state;
  }

  public Instant getClaimedAt() {
    return claimedAt;
  }

  void markClaimed(String workerId, Instant claimedAt) {
    this.workerId = workerId;
    this.state = ClaimState.CLAIMED;
    this.claimedAt = claimedAt;
  }

  void markCompleted() {
    this.state = ClaimState.COMPLETED;
  }

  void markQueued() {
    this.workerId = null;
    this.state = ClaimState.QUEUED;
    this.claimedAt = null;
  }

  @Override
  public String toString() {
    return "PartitionClaim{"
        + "runId='" + runId + '\''
        + ", partitionKey='" + partitionKey + '\''
        + ", workerId='" + workerId + '\''
        + ", state=" + state
        + ", claimedAt=" + claimedAt
        + '}';
  }
}
