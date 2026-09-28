#!/usr/bin/env python3
"""PostToolUse hook: format the file Droid just created or edited.

Runs the repo-local Prettier on TS/JS/CSS/JSON/Markdown/HTML files that live
inside this project. Complements .husky/pre-commit (lint-staged) by formatting
at agent-edit time instead of commit time. Non-blocking by design: unexpected
Prettier trouble is logged to stderr but never blocks the agent.
"""
import json
import os
import subprocess
import sys

PRETTIER_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md", ".html",
}


def main():
    try:
        payload = json.load(sys.stdin)
    except (ValueError, TypeError):
        return 0  # malformed hook input is never worth blocking on

    tool_input = payload.get("tool_input") or {}
    file_path = tool_input.get("file_path") or ""
    project_dir = os.environ.get("FACTORY_PROJECT_DIR") or payload.get("cwd") or ""
    if not file_path or not project_dir:
        return 0

    real_file = os.path.realpath(file_path)
    real_project = os.path.realpath(project_dir)
    if not real_file.startswith(real_project + os.sep):
        return 0
    if os.path.splitext(real_file)[1].lower() not in PRETTIER_EXTENSIONS:
        return 0

    prettier = os.path.join(real_project, "node_modules", ".bin", "prettier")
    if not os.path.isfile(prettier):
        return 0

    proc = subprocess.run(
        [prettier, "--write", real_file],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    rel = os.path.relpath(real_file, real_project)
    if proc.returncode == 0:
        sys.stdout.write("[project hook] prettier formatted {}\n".format(rel))
        return 0
    sys.stderr.write(
        "[project hook] prettier failed on {} (non-blocking): {}\n".format(
            rel, proc.stderr.decode("utf-8", "replace").strip()
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
