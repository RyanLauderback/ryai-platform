# Testing

Corvex Console has two test layers: Vitest plus React Testing Library for unit and integration tests under `src/`, and a single Playwright end-to-end smoke spec under `e2e/`. Coverage thresholds are enforced, so most source changes need accompanying tests.

## Vitest and React Testing Library

The `test` block in `vite.config.ts` configures Vitest: `jsdom` environment, globals enabled, tests matched by `src/**/*.test.{ts,tsx}`, and `./src/test/setup.ts` as the setup file. `tsconfig.json` adds the `vitest/globals` and `@testing-library/jest-dom` types so `describe`, `expect`, and matchers like `toBeInTheDocument` work without imports.

### Setup file behavior

`src/test/setup.ts` runs before every test file and provides isolation:

- `beforeAll` starts the MSW node server from `src/mocks/server.ts` with `onUnhandledRequest: "error"`, so any request not covered by a handler in `src/mocks/handlers.ts` fails the test loudly.
- `afterEach` runs RTL `cleanup()`, `server.resetHandlers()`, `resetMockData()` (restores the mutable key/connector/webhook arrays in `src/mocks/handlers.ts` from `src/mocks/data.ts`), and `localStorage.clear()`. Mutations in one test, such as creating an API key, never leak into the next.
- `afterAll` closes the server.
- It stubs `ResizeObserver` with a no-op class and `window.matchMedia` with a mock, because jsdom implements neither and Recharts plus responsive components need them. See [debugging](debugging.md) for the symptoms when these are missing.

### Existing suites

- `src/test/app.test.tsx` — 8 integration tests rendering the app through its router against the MSW server.
- `src/test/analytics.test.ts` — unit tests for the pure transform functions in `src/lib/analytics.ts` that shape `UsageDay` rows into chart inputs.

### data-testid contract

Tests and the Playwright spec select elements by stable `data-testid` attributes (for example `explorer-search`, `assistant-send`, `analytics-page`) rather than by styling classes, which change often. When you modify a component, keep existing testids; when you add interactive elements that tests or e2e should reach, add a testid. `CONTRIBUTING.md` lists this as an explicit rule.

## Coverage

`npm run test:coverage` runs Vitest with the v8 provider and text plus HTML reporters (HTML output in `coverage/`). Configuration in `vite.config.ts`:

- Includes `src/**/*.{ts,tsx}`.
- Excludes `src/main.tsx`, `src/mocks/**`, `src/test/**`, and `src/components/ui/**`.
- Thresholds: 70% statements and 70% lines. There are no branch or function thresholds.

A run below threshold exits nonzero and fails CI.

## Playwright smoke test

`e2e/smoke.spec.ts` contains one test, "landing to complete console workflow", that exercises the whole product: landing page hero, demo login, dashboard, explorer search with result count, document viewer, assistant message with citations, API key create/reveal/revoke on Integrations, and the Analytics and Settings pages.

`playwright.config.ts`:

- `testDir: ./e2e`, `fullyParallel: true`, `retries: 2` in CI only, `list` reporter.
- `baseURL: http://127.0.0.1:4173` and `trace: "on-first-retry"`.
- A `webServer` block starts `npm run preview -- --host 127.0.0.1` (vite preview on port 4173) and reuses an existing server locally. Preview serves the production build, so run `npm run build` first or let a previous build stand; the config does not build for you.
- One project, `chromium`, using the locally installed Chrome channel outside CI.

### Running and debugging

```bash
npm run build && npm run test:e2e     # headless run
npx playwright test --ui              # interactive UI mode
npx playwright test --debug           # step through in the inspector
npx playwright show-trace test-results/<dir>/trace.zip   # view a retry trace
```

On failure in CI, traces are captured on first retry under `test-results/`. More tips in [debugging](debugging.md). For how these commands fit the merge gate, see [development workflow](development-workflow.md).
