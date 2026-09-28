package com.corvex.edgar.runs;

/** Lifecycle of one partition inside a run. */
public enum ClaimState {
  QUEUED,
  CLAIMED,
  COMPLETED
}
