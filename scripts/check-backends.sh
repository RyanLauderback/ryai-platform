#!/usr/bin/env bash
# Runs the static checks and unit tests for the legacy ingestion backends.
#
# Usage: scripts/check-backends.sh [all|edgar|voxledger|pulsewire|ledgerline]
# (default: all). Backends run one at a time in the fixed order
# edgar, voxledger, pulsewire, ledgerline. Works from any working directory.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)"

ALL_TARGETS=(edgar voxledger pulsewire ledgerline)

dir_for() {
  case "$1" in
    edgar) printf '%s\n' "corvex-edgar" ;;
    voxledger) printf '%s\n' "voxledger-transcripts" ;;
    pulsewire) printf '%s\n' "pulsewire-news" ;;
    ledgerline) printf '%s\n' "ledgerline-private" ;;
    *) return 1 ;;
  esac
}

require_jdk17() {
  if [ -z "${JAVA_HOME:-}" ]; then
    echo "check-backends.sh: error: JAVA_HOME is not set; JDK 17 or newer is required to build the Java backends" >&2
    return 1
  fi
  if [ ! -x "$JAVA_HOME/bin/java" ]; then
    echo "check-backends.sh: error: JAVA_HOME ($JAVA_HOME) has no executable bin/java; point JAVA_HOME at a JDK 17 or newer" >&2
    return 1
  fi
  local version major
  version="$("$JAVA_HOME/bin/java" -version 2>&1 | sed -n 's/.*version "\([^"]*\)".*/\1/p' | head -n 1)"
  major="${version%%.*}"
  if [ "$major" = "1" ]; then
    major="$(printf '%s' "$version" | cut -d. -f2)"
  fi
  if ! [[ "$major" =~ ^[0-9]+$ ]] || [ "$major" -lt 17 ]; then
    echo "check-backends.sh: error: JAVA_HOME points to JDK ${version:-unknown} (< 17); JDK 17 or newer is required" >&2
    return 1
  fi
}

require_uv() {
  if ! command -v uv >/dev/null 2>&1; then
    echo "check-backends.sh: error: uv was not found on PATH; uv is required to build the Python backends" >&2
    return 1
  fi
}

preflight() {
  case "$1" in
    edgar) require_jdk17 && require_uv ;;
    voxledger) require_uv ;;
    pulsewire) require_jdk17 ;;
    ledgerline) require_uv ;;
    *) return 1 ;;
  esac
}

# NOTE: these functions run under `if`/`&&` conditions, which disables `set -e`
# for their whole body (and an inner `set -e` does not re-enable it). Every step
# is therefore chained with `&&` (or `|| exit 1`) so an early failing check
# cannot be masked by a later passing one.
run_edgar() {
  (
    cd "$REPO_ROOT/corvex-edgar" &&
      ./mvnw -B -q verify &&
      cd "$REPO_ROOT/corvex-edgar/orchestration/airflow" &&
      uv sync --frozen &&
      uv run ruff check . &&
      uv run mypy
  )
}

run_voxledger() {
  (
    cd "$REPO_ROOT/voxledger-transcripts" &&
      uv sync --frozen &&
      uv run ruff check . &&
      uv run mypy &&
      uv run pytest -q
  )
}

run_pulsewire() {
  (
    cd "$REPO_ROOT/pulsewire-news" &&
      ./gradlew check --no-daemon -q
  )
}

run_ledgerline() {
  (
    cd "$REPO_ROOT/ledgerline-private" || exit 1
    if [ ! -d .venv ]; then
      uv venv --python 3.12 .venv || exit 1
    fi
    uv pip install --python .venv/bin/python -r requirements-dev.txt &&
      .venv/bin/ruff check . &&
      .venv/bin/mypy &&
      .venv/bin/pytest -q
  )
}

usage() {
  echo "usage: check-backends.sh [all|edgar|voxledger|pulsewire|ledgerline]" >&2
}

main() {
  local target="${1:-all}"
  case "$target" in
    all | edgar | voxledger | pulsewire | ledgerline) ;;
    *)
      echo "check-backends.sh: error: unknown target '$target'" >&2
      usage
      exit 2
      ;;
  esac

  if [ "$target" != "all" ]; then
    local dir
    dir="$(dir_for "$target")"
    if [ ! -d "$REPO_ROOT/$dir" ]; then
      echo "check-backends.sh: error: backend '$target' is not present (missing directory: $dir)" >&2
      exit 1
    fi
    if ! preflight "$target"; then
      exit 1
    fi
    if "run_$target"; then
      echo "==> $target: PASS"
      exit 0
    else
      echo "==> $target: FAIL"
      exit 1
    fi
  fi

  local passed=0 failed=0 skipped=0 present=0
  local t dir
  for t in "${ALL_TARGETS[@]}"; do
    dir="$(dir_for "$t")"
    if [ ! -d "$REPO_ROOT/$dir" ]; then
      echo "==> $t: SKIPPED (not present)"
      skipped=$((skipped + 1))
      continue
    fi
    present=$((present + 1))
    if preflight "$t" && "run_$t"; then
      echo "==> $t: PASS"
      passed=$((passed + 1))
    else
      echo "==> $t: FAIL"
      failed=$((failed + 1))
    fi
  done

  echo "==> Summary: $passed passed, $failed failed, $skipped skipped (of ${#ALL_TARGETS[@]} targets)"
  if [ "$present" -eq 0 ]; then
    echo "check-backends.sh: error: no backend is present; nothing to check" >&2
    exit 1
  fi
  if [ "$failed" -gt 0 ]; then
    exit 1
  fi
}

main "$@"
