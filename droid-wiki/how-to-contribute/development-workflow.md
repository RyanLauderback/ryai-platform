# Development workflow

Work flows from a prefixed branch, through Conventional Commits enforced by Husky hooks, into a pull request that must pass a single CI job. The rules live in `CONTRIBUTING.md`; this page walks through the cycle.

## Branch naming

Create a branch from the latest `main` with one of five prefixes:

| Prefix | Use |
| --- | --- |
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, dependency bumps, config |
| `docs/` | Documentation only |
| `test/` | Test-only changes |

Example: `git switch -c feat/explorer-sector-filters`.

## Commits

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/). `commitlint.config.js` extends `@commitlint/config-conventional` with no overrides. Examples that pass:

```
feat(explorer): add sector filters
fix(assistant): read document deep-link param
chore(deps): bump vite to 5.4.11
docs(readme): document preview port
test(analytics): cover empty usage range
```

## Husky hooks

Two hooks are installed by `npm run prepare` (which runs automatically on `npm install` via the `prepare` script):

- `.husky/pre-commit` runs `npx lint-staged`. The `lint-staged` config in `package.json` runs `eslint --fix` and `prettier --write` on staged `*.{ts,tsx}` files, and `prettier --write` on staged `*.{json,md,css,yml,yaml}` files.
- `.husky/commit-msg` runs `npx --no -- commitlint --edit "$1"`, rejecting non-conventional messages before the commit is created.

Because hooks fix staged files in place, re-stage any files lint-staged modified before committing again.

## Pull request cycle

1. Push the branch and open a PR against `main`. `main` is protected; direct pushes are rejected.
2. Fill in `.github/pull_request_template.md`: summary, the five-item validation checklist, and screenshots for visible changes.
3. Request review from `@corvex-demo/platform` per `.github/CODEOWNERS` (a placeholder team; the maintainer reviews).
4. Address feedback with additional commits on the same branch. Merge once CI is green and review is approved.

## What CI runs

`.github/workflows/ci.yml` triggers on pull requests and pushes to `main`. The single `quality` job on `ubuntu-latest` uses Node 20 with npm caching, then runs in order:

1. `npm ci`
2. `npm run lint` (ESLint, zero warnings allowed)
3. `npm run typecheck` (`tsc --noEmit`)
4. `npm run test:coverage` (Vitest with 70% thresholds)
5. `npm run build` (typecheck plus production build)
6. `npx playwright install --with-deps chromium`
7. `npm run test:e2e` (Playwright smoke test against `vite preview`)

Any step failure blocks the merge. For how the test suites behave, see [testing](testing.md); for the build and deploy output CI produces, see [deployment](../deployment.md).
