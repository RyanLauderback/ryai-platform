package com.corvex.edgar.runs;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/** Durable record of run partitions and their claims. */
public interface ClaimLedger {

  /** Registers a run with its partitions in processing order; every partition starts QUEUED. */
  void createRun(String runId, List<String> partitionKeys);

  /** Claims the first QUEUED partition of the run, in creation order, for the worker. */
  Optional<PartitionClaim> claimNext(String runId, String workerId, Instant claimedAt);

  /** Marks a claimed partition completed. */
  void complete(String runId, String partitionKey, String workerId);

  /** Puts a claimed partition back to QUEUED so another worker can pick it up. */
  void release(String runId, String partitionKey);

  /** All partitions of a run, in creation order. */
  List<PartitionClaim> claimsForRun(String runId);

  /** All claims in the given state across every run. */
  List<PartitionClaim> claimsInState(ClaimState state);
}
