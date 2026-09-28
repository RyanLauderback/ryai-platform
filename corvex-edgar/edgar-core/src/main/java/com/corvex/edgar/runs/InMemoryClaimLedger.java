package com.corvex.edgar.runs;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** In-memory {@link ClaimLedger}, used by the single-process loader and by tests. */
public final class InMemoryClaimLedger implements ClaimLedger {

  private final Map<String, LinkedHashMap<String, PartitionClaim>> runs = new LinkedHashMap<>();

  public InMemoryClaimLedger() {}

  @Override
  public synchronized void createRun(String runId, List<String> partitionKeys) {
    if (runs.containsKey(runId)) {
      throw new IllegalArgumentException("run already exists: " + runId);
    }
    LinkedHashMap<String, PartitionClaim> partitions = new LinkedHashMap<>();
    for (String partitionKey : partitionKeys) {
      partitions.put(partitionKey, new PartitionClaim(runId, partitionKey));
    }
    runs.put(runId, partitions);
  }

  @Override
  public synchronized Optional<PartitionClaim> claimNext(
      String runId, String workerId, Instant claimedAt) {
    for (PartitionClaim claim : partitions(runId).values()) {
      if (claim.getState() == ClaimState.QUEUED) {
        claim.markClaimed(workerId, claimedAt);
        return Optional.of(new PartitionClaim(claim));
      }
    }
    return Optional.empty();
  }

  @Override
  public synchronized void complete(String runId, String partitionKey, String workerId) {
    PartitionClaim claim = claim(runId, partitionKey);
    if (claim.getState() != ClaimState.CLAIMED) {
      throw new IllegalStateException(
          "partition " + partitionKey + " of run " + runId + " is not claimed");
    }
    claim.markCompleted();
  }

  @Override
  public synchronized void release(String runId, String partitionKey) {
    claim(runId, partitionKey).markQueued();
  }

  @Override
  public synchronized List<PartitionClaim> claimsForRun(String runId) {
    List<PartitionClaim> out = new ArrayList<>();
    for (PartitionClaim claim : partitions(runId).values()) {
      out.add(new PartitionClaim(claim));
    }
    return out;
  }

  @Override
  public synchronized List<PartitionClaim> claimsInState(ClaimState state) {
    List<PartitionClaim> out = new ArrayList<>();
    for (LinkedHashMap<String, PartitionClaim> partitions : runs.values()) {
      for (PartitionClaim claim : partitions.values()) {
        if (claim.getState() == state) {
          out.add(new PartitionClaim(claim));
        }
      }
    }
    return out;
  }

  private LinkedHashMap<String, PartitionClaim> partitions(String runId) {
    LinkedHashMap<String, PartitionClaim> partitions = runs.get(runId);
    if (partitions == null) {
      throw new IllegalArgumentException("unknown run: " + runId);
    }
    return partitions;
  }

  private PartitionClaim claim(String runId, String partitionKey) {
    PartitionClaim claim = partitions(runId).get(partitionKey);
    if (claim == null) {
      throw new IllegalArgumentException("unknown partition " + partitionKey + " of run " + runId);
    }
    return claim;
  }
}
