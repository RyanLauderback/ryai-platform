package com.corvex.edgar.runs;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Coordinates the partition claims of one ingest run across the worker fleet. Workers claim
 * partitions in run order, heartbeat while they work, and shut down gracefully when they drain;
 * on startup a worker calls {@link #recoverOnStartup(String)} to hand back work that a cleanly
 * stopped worker left claimed.
 */
public final class PartitionRunCoordinator {

  private final ClaimLedger ledger;
  private final WorkerRegistry workers;
  private final Duration claimTtl;
  private final Clock clock;

  public PartitionRunCoordinator(
      ClaimLedger ledger, WorkerRegistry workers, Duration claimTtl, Clock clock) {
    this.ledger = Objects.requireNonNull(ledger, "ledger");
    this.workers = Objects.requireNonNull(workers, "workers");
    this.claimTtl = Objects.requireNonNull(claimTtl, "claimTtl");
    this.clock = Objects.requireNonNull(clock, "clock");
  }

  /** Registers a run; every partition starts QUEUED. */
  public void createRun(String runId, List<String> partitionKeys) {
    ledger.createRun(runId, partitionKeys);
  }

  /** Registers a worker as ACTIVE with its first heartbeat. */
  public void registerWorker(String workerId) {
    workers.register(workerId, clock.instant());
  }

  public void heartbeat(String workerId) {
    workers.recordHeartbeat(workerId, clock.instant());
  }

  /** Claims the first QUEUED partition of the run, in the order given to {@link #createRun}. */
  public Optional<PartitionClaim> claimNext(String runId, String workerId) {
    if (workers.stateOf(workerId) != WorkerState.ACTIVE) {
      throw new IllegalStateException("worker " + workerId + " is not active");
    }
    return ledger.claimNext(runId, workerId, clock.instant());
  }

  /** Marks a claimed partition completed. */
  public void complete(String runId, String partitionKey, String workerId) {
    ledger.complete(runId, partitionKey, workerId);
  }

  /** Drains a worker: it stops heartbeating and leaves its claims to the next recovery pass. */
  public void shutdownGracefully(String workerId) {
    workers.markStopped(workerId);
  }

  /**
   * Releases claims left behind by workers that announced a clean shutdown, so a fresh worker can
   * reprocess them. Returns the number of claims released.
   */
  public int recoverOnStartup(String workerId) {
    workers.stateOf(workerId);
    int released = 0;
    for (PartitionClaim claim : ledger.claimsInState(ClaimState.CLAIMED)) {
      if (workers.stateOf(claim.getWorkerId()) == WorkerState.STOPPED) {
        ledger.release(claim.getRunId(), claim.getPartitionKey());
        released++;
      }
    }
    return released;
  }

  /** Rolls the partition claims of a run up to a single status. */
  public RunStatus status(String runId) {
    List<PartitionClaim> claims = ledger.claimsForRun(runId);
    boolean allCompleted = true;
    for (PartitionClaim claim : claims) {
      if (claim.getState() != ClaimState.COMPLETED) {
        allCompleted = false;
        break;
      }
    }
    if (allCompleted) {
      return RunStatus.SUCCEEDED;
    }
    Instant now = clock.instant();
    for (PartitionClaim claim : claims) {
      if (claim.getState() == ClaimState.CLAIMED) {
        Optional<Instant> heartbeat = workers.lastHeartbeat(claim.getWorkerId());
        if (heartbeat.isPresent() && !heartbeat.get().plus(claimTtl).isBefore(now)) {
          return RunStatus.RUNNING;
        }
      }
    }
    return RunStatus.QUEUED;
  }
}
