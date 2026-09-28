package com.corvex.edgar.runs;

/** Roll-up status of a run, derived from its partition claims. */
public enum RunStatus {
  QUEUED,
  RUNNING,
  SUCCEEDED
}
