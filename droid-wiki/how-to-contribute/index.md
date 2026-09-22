# How to contribute

Corvex Console is a demo repository, but it follows a real contribution workflow: protected `main`, pull requests with a template, CODEOWNERS review, and a five-command CI gate. This section covers how to pick up work, get it reviewed, and know when it is done.

## Work pickup

There is no external issue tracker. Work starts from the README, `CHANGELOG.md`, or a known gap such as the items in [cleanup opportunities](../cleanup-opportunities.md). Create a focused branch from the latest `main` and keep the change scoped to one concern.

## Pull request process

1. Branch from `main` using a prefix from `CONTRIBUTING.md`: `feat/`, `fix/`, `chore/`, `docs/`, or `test/`. Direct commits and pushes to `main` are not allowed; the branch is protected.
2. Open a pull request and fill in `.github/pull_request_template.md`: a summary of what changed and why, the validation checklist, and before/after screenshots for visible changes.
3. Request review from the CODEOWNERS entry. `.github/CODEOWNERS` assigns `* @corvex-demo/platform`, a placeholder team; in practice the sole human maintainer (RyanLauderback) reviews.

## Review expectations

- All five CI checks from `.github/workflows/ci.yml` must pass before merge. They mirror the local gate commands listed below.
- Reviewers look for the conventions in [patterns and conventions](patterns-and-conventions.md): focused components, dynamic data routed through MSW handlers, stable `data-testid` selectors, and branded copy centralized in `src/config/brand.ts`.
- Commit messages must follow Conventional Commits; commitlint rejects non-conforming messages at commit time.

## Definition of done

A change is done when every gate command passes locally and in CI:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run test:e2e
```

`npm run test:coverage` enforces 70% statement and line thresholds configured in `vite.config.ts`, so new source code generally needs tests. See [testing](testing.md) for how the suites work and [development workflow](development-workflow.md) for the branch-to-merge cycle.

## In this section

- [Development workflow](development-workflow.md) — branches, commits, hooks, and the PR cycle.
- [Patterns and conventions](patterns-and-conventions.md) — code style and architectural rules.
- [Testing](testing.md) — Vitest, RTL, MSW, coverage, and Playwright.
- [Debugging](debugging.md) — common pitfalls and how to inspect failures.
- [Tooling](tooling.md) — what every root config file does.
