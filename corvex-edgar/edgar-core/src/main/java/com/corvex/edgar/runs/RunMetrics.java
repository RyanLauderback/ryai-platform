package com.corvex.edgar.runs;

/**
 * Observability hooks for run coordination. Implementations forward to the metrics backend; pass
 * {@link #NOOP} when nothing is wired.
 */
public interface RunMetrics {

  /** Discards every metric. */
  RunMetrics NOOP = (runId, claimedPartitions) -> {};

  /**
   * Records that a run rolled up to QUEUED while it still holds claimed partitions: the queue
   * state diverges from what the workers are actually executing.
   *
   * @param runId the run whose status diverges
   * @param claimedPartitions the number of partitions still claimed while the run reads QUEUED
   */
  void queueStateDivergence(String runId, int claimedPartitions);
}
