# AGENTS.md

Guidance for automated contributors (Factory Droid and others) working in this repository.

## Project

Corvex Console is a fictional market-intelligence platform demo. It is a static SPA:
Vite 5 + React 18 + strict TypeScript, React Router v6, Tailwind CSS + shadcn-style
Radix components, TanStack Query, Zustand, MSW (mock API), Recharts. Tests run on
Vitest + React Testing Library and Playwright. There is no real backend; MSW serves
all data from fixtures in `src/mocks/data.ts`.

## Commands

- `npm ci` — install dependencies
- `npm run dev` — local dev server with mocks enabled
- Quality gates, all required before opening or updating a PR:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:coverage` (70% statement/line threshold, enforced in `vite.config.ts`)
  - `npm run build`
- `npm run test:e2e` — Playwright smoke flow; run it when you change a user flow.

## Conventions

- **Copy and brand**: all company, product, and marketing copy lives in
  `src/config/brand.ts`. Change copy there, not in components. Tests assert against
  `brand.*` values, so copy-only changes should not break tests.
- **Data**: all dynamic data flows through MSW handlers (`src/mocks/handlers.ts`) backed
  by fixtures (`src/mocks/data.ts`). Never add real network calls or secrets.
- **Test selectors**: interactive elements carry stable `data-testid` attributes. Update
  tests in the same commit as the change they cover.
- **Naming**: use `camelCase` for variables, parameters, and non-component functions;
  use `PascalCase` for React components, destructured component values such as
  `Icon`, and type-like declarations. Immutable constants may use `UPPER_CASE` when
  that convention improves readability. ESLint enforces these naming conventions.
- **Deep documentation**: `droid-wiki/` explains the codebase. Start with
  `droid-wiki/how-to-contribute/` for workflow detail and `droid-wiki/features/` for
  per-area behavior.

## Git workflow

- Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `test/`. For ticket work use
  `feat/<ticket-key>-<slug>`, for example `feat/cvx-142-hero-cta`.
- Commit messages follow Conventional Commits (enforced by commitlint):
  `feat:`, `fix:`, `chore:`, `docs:`, `test:`. Reference the ticket key in the body.
- `main` is protected: PRs are required and the `quality` CI check must pass. Fill in
  the PR template. Do not merge your own PR; a human merges after review.

## Jira workflow

When asked to pick up a Jira ticket:

1. Read the ticket through the Jira connector. Its summary, description, and acceptance
   criteria are the source of truth for scope. Stay inside that scope.
2. Create the branch, implement the change, satisfy every acceptance criterion, and run
   the quality gates.
3. Push and open a PR to `main` with the ticket URL
   (`https://ryanpersonalorg.atlassian.net/browse/<KEY>`) in the body.
4. Comment the PR URL on the ticket and transition it to In Review (or the closest
   available status).
5. Report the branch, PR URL, and gate results.

If a ticket is ambiguous, prefer the smallest change that satisfies its acceptance
criteria and note your assumptions in the PR body.
