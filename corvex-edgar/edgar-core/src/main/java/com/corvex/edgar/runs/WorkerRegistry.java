package com.corvex.edgar.runs;

import java.time.Instant;
import java.util.Optional;

/** Registry of pipeline workers and their heartbeats. */
public interface WorkerRegistry {

  /** Registers a worker as ACTIVE; the registration time doubles as the first heartbeat. */
  void register(String workerId, Instant registeredAt);

  /** Records a heartbeat for a registered worker. */
  void recordHeartbeat(String workerId, Instant at);

  /** Marks a worker STOPPED after it has shut itself down cleanly. */
  void markStopped(String workerId);

  WorkerState stateOf(String workerId);

  Optional<Instant> lastHeartbeat(String workerId);
}
