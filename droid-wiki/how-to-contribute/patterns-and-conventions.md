# Patterns and conventions

The conventions below are enforced by configuration, tests, or `CONTRIBUTING.md`. Follow them so small changes stay small.

## Centralize copy and data

- All company, product, and marketing copy lives in `src/config/brand.ts`. Tests assert UI text against `brand.*` values rather than string literals, so a copy change in one file keeps tests passing.
- All dynamic data flows through MSW handlers in `src/mocks/handlers.ts` backed by fixtures in `src/mocks/data.ts`. Do not fetch from real endpoints and do not hardcode tenant data inside page components.

## Stable test selectors

Interactive and asserted elements carry `data-testid` attributes (for example `demo-login`, `explorer-search`, `assistant-citations`, `create-key-submit`, `key-secret`). Both React Testing Library and Playwright depend on them. When you add an interactive element, add a stable `data-testid`; when you change one, update the tests in the same commit.

## Data fetching

Use TanStack Query for every server (mock) interaction:

- Reads use `useQuery` with functions from `src/lib/api.ts` and consistent query keys such as `["documents", params]` and `["document", id]`.
- Writes use `useMutation` with optimistic `setQueryData` updates and rollback in `onError`. `src/pages/app/IntegrationsPage.tsx` shows the pattern for key revocation and connector toggles.

## UI components

- Shared primitives live in `src/components/ui/` (button, card, dialog, input, badge) and use `cva` variants plus the `cn()` helper from `src/lib/utils.ts`.
- Pages use Radix primitives directly where no wrapper exists yet (Switch, Tabs). If you need the same primitive twice, add a wrapper under `src/components/ui/` first.
- Keep components small and single-responsibility; section-level composition belongs in the page or section component, not in shared UI.

## Styling

Tailwind utility classes with the palette from `tailwind.config.ts` (`ink`, `brand`, `mint`, `surface`), which mirrors `brand.theme` in `src/config/brand.ts`. Dark mode uses the `class` strategy and the persisted store in `src/store/theme.ts`.

## State

Use Zustand for client state and keep it minimal. Today there are exactly two persisted stores: auth (`src/store/auth.ts`) and theme (`src/store/theme.ts`). Prefer deriving values from React Query cache over adding new stores.

## Commits, branches, and hooks

- Branch names use `feat/*`, `fix/*`, `chore/*`, `docs/*`, or `test/*` prefixes.
- Commit messages follow Conventional Commits, enforced by commitlint via `.husky/commit-msg`.
- `lint-staged` runs ESLint and Prettier on staged files via `.husky/pre-commit`.

## Quality gates

All five commands must pass before a PR is considered ready:

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build && npm run test:e2e
```

Coverage thresholds (70% statements and lines) are configured in `vite.config.ts` and exclude `src/main.tsx`, `src/mocks/**`, `src/test/**`, and `src/components/ui/**`.

## Related pages

- [Development workflow](development-workflow.md) — branch-to-merge cycle
- [Testing](testing.md) — frameworks, fixtures, and coverage rules
- [Tooling](tooling.md) — the configs behind these conventions
