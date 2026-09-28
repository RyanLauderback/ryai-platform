package com.corvex.edgar.runs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PartitionRunCoordinatorTest {

  private static final Duration CLAIM_TTL = Duration.ofMinutes(15);

  private PartitionRunCoordinator coordinator;

  @BeforeEach
  void setUp() {
    Clock clock = Clock.fixed(Instant.parse("2026-08-27T06:00:00Z"), ZoneOffset.UTC);
    coordinator =
        new PartitionRunCoordinator(
            new InMemoryClaimLedger(), new InMemoryWorkerRegistry(), CLAIM_TTL, clock);
  }

  @Test
  void claimsPartitionsInRunOrder() {
    coordinator.createRun("run-1", List.of("dt=2026-08-27/exchange=NASDAQ", "dt=2026-08-27/exchange=NYSE"));
    coordinator.registerWorker("w1");

    Optional<PartitionClaim> first = coordinator.claimNext("run-1", "w1");
    Optional<PartitionClaim> second = coordinator.claimNext("run-1", "w1");

    assertTrue(first.isPresent());
    assertEquals("dt=2026-08-27/exchange=NASDAQ", first.get().getPartitionKey());
    assertEquals("w1", first.get().getWorkerId());
    assertTrue(second.isPresent());
    assertEquals("dt=2026-08-27/exchange=NYSE", second.get().getPartitionKey());
    assertTrue(coordinator.claimNext("run-1", "w1").isEmpty());
  }

  @Test
  void statusMovesFromQueuedToRunningToSucceeded() {
    coordinator.createRun("run-2", List.of("p1", "p2"));
    coordinator.registerWorker("w1");

    assertEquals(RunStatus.QUEUED, coordinator.status("run-2"));

    coordinator.claimNext("run-2", "w1");
    assertEquals(RunStatus.RUNNING, coordinator.status("run-2"));

    coordinator.complete("run-2", "p1", "w1");
    coordinator.claimNext("run-2", "w1");
    coordinator.complete("run-2", "p2", "w1");
    assertEquals(RunStatus.SUCCEEDED, coordinator.status("run-2"));
  }

  @Test
  void recoveryAfterGracefulShutdownHandsClaimsToTheNextWorker() {
    coordinator.createRun("run-3", List.of("p1", "p2"));
    coordinator.registerWorker("w1");
    coordinator.claimNext("run-3", "w1");
    coordinator.shutdownGracefully("w1");

    coordinator.registerWorker("w2");
    assertEquals(1, coordinator.recoverOnStartup("w2"));

    Optional<PartitionClaim> reclaimed = coordinator.claimNext("run-3", "w2");
    assertTrue(reclaimed.isPresent());
    assertEquals("p1", reclaimed.get().getPartitionKey());
    coordinator.complete("run-3", "p1", "w2");
    coordinator.claimNext("run-3", "w2");
    coordinator.complete("run-3", "p2", "w2");

    assertEquals(RunStatus.SUCCEEDED, coordinator.status("run-3"));
  }

  @Test
  void recoveryWithNothingToReleaseReturnsZero() {
    coordinator.createRun("run-4", List.of("p1"));
    coordinator.registerWorker("w1");
    coordinator.claimNext("run-4", "w1");

    coordinator.registerWorker("w2");
    assertEquals(0, coordinator.recoverOnStartup("w2"));
  }

  @Test
  void stoppedWorkerCannotClaim() {
    coordinator.createRun("run-5", List.of("p1"));
    coordinator.registerWorker("w1");
    coordinator.shutdownGracefully("w1");

    assertThrows(IllegalStateException.class, () -> coordinator.claimNext("run-5", "w1"));
  }

  @Test
  void heartbeatKeepsAClaimRunning() {
    coordinator.createRun("run-6", List.of("p1"));
    coordinator.registerWorker("w1");
    coordinator.claimNext("run-6", "w1");

    coordinator.heartbeat("w1");

    assertEquals(RunStatus.RUNNING, coordinator.status("run-6"));
  }
}
