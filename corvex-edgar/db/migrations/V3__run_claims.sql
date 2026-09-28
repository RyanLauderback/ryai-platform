-- Partition claims for ingest runs: one row per partition of a run.
CREATE TABLE run_claim (
    run_id        VARCHAR(64)  NOT NULL,
    partition_key VARCHAR(128) NOT NULL,
    partition_seq INTEGER      NOT NULL,
    worker_id     VARCHAR(64),
    status        VARCHAR(16)  NOT NULL DEFAULT 'QUEUED',
    claimed_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    PRIMARY KEY (run_id, partition_key)
);

-- Worker registry: last heartbeat per worker.
CREATE TABLE run_worker (
    worker_id       VARCHAR(64) NOT NULL PRIMARY KEY,
    state           VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    last_heartbeat  TIMESTAMPTZ NOT NULL,
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_run_claim_status ON run_claim (status);
