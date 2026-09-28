package com.corvex.edgar.runs;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/** In-memory {@link WorkerRegistry}, used by the single-process loader and by tests. */
public final class InMemoryWorkerRegistry implements WorkerRegistry {

  private static final class Entry {
    private WorkerState state;
    private Instant lastHeartbeat;

    private Entry(WorkerState state, Instant lastHeartbeat) {
      this.state = state;
      this.lastHeartbeat = lastHeartbeat;
    }
  }

  private final Map<String, Entry> workers = new HashMap<>();

  public InMemoryWorkerRegistry() {}

  @Override
  public synchronized void register(String workerId, Instant registeredAt) {
    workers.put(workerId, new Entry(WorkerState.ACTIVE, registeredAt));
  }

  @Override
  public synchronized void recordHeartbeat(String workerId, Instant at) {
    entry(workerId).lastHeartbeat = at;
  }

  @Override
  public synchronized void markStopped(String workerId) {
    entry(workerId).state = WorkerState.STOPPED;
  }

  @Override
  public synchronized WorkerState stateOf(String workerId) {
    return entry(workerId).state;
  }

  @Override
  public synchronized Optional<Instant> lastHeartbeat(String workerId) {
    Entry entry = workers.get(workerId);
    return entry == null ? Optional.empty() : Optional.of(entry.lastHeartbeat);
  }

  private Entry entry(String workerId) {
    Entry entry = workers.get(workerId);
    if (entry == null) {
      throw new IllegalArgumentException("unknown worker: " + workerId);
    }
    return entry;
  }
}
