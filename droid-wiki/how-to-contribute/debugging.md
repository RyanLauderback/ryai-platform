# Debugging

Most problems in this repo fall into four buckets: MSW interception, jsdom limitations, local environment drift, and Playwright failures. This page lists the symptoms and fixes for each.

## Inspecting MSW interception

All dynamic data comes from MSW. There are two runtimes:

- **Browser (dev and preview):** `src/main.tsx` starts the service worker from `src/mocks/browser.ts` when `import.meta.env.VITE_ENABLE_MOCKS === "true"`. The worker script is `public/mockServiceWorker.js` (installed via the `msw.workerDirectory` setting in `package.json`). To see intercepted traffic, open DevTools: the **Network** tab shows `/api/*` requests served from the service worker (look for "ServiceWorker" in the Size column), and **Application → Service Workers** shows the worker itself. Console logs from MSW list each intercepted request.
- **Tests:** `src/mocks/server.ts` runs a node server with `onUnhandledRequest: "error"` (see `src/test/setup.ts`). A test hitting an unmocked endpoint fails with an MSW unhandled-request error naming the method and URL; add a handler in `src/mocks/handlers.ts` or override per-test with `server.use(...)`.

If the app loads but every screen is empty, first check that `VITE_ENABLE_MOCKS` is `true` in `.env` (see `.env.example`) and that the service worker registered.

## jsdom test pitfalls

- **Missing browser APIs:** jsdom has no `ResizeObserver` or `matchMedia`. `src/test/setup.ts` stubs both. If you render a component in a new test file without the setup file (or in another project), expect `ReferenceError: ResizeObserver is not defined`.
- **Recharts zero-size warnings:** Recharts `ResponsiveContainer` measures its parent, which is 0×0 in jsdom, so it logs warnings like "The width(0) and height(0) of chart should be greater than 0". These are harmless in tests; assert on page content and testids rather than on chart internals.
- **React Router future-flag warnings:** React Router v6 logs deprecation warnings about `v7_startTransition` and `v7_relativeSplatPath` future flags. They are noise from the router version, not from your code.
- **State leaking between tests:** if a test sees keys, connectors, or webhooks from a previous test, confirm the `afterEach` in `src/test/setup.ts` ran; `resetMockData()` only restores state for tests using the shared setup.

## Local environment warnings

- **Node version:** `package.json` declares `engines: node >=20`, and CI and `netlify.toml` both pin Node 20. Older Node versions can fail on Vite 5 or produce engine warnings from npm. Check with `node -v`.
- **Stale lockfile:** after pulling, run `npm ci` rather than `npm install` to match CI exactly.
- **Hooks missing:** if commitlint or lint-staged did not run on commit, run `npm run prepare` to reinstall Husky hooks.

## Playwright failures

`playwright.config.ts` records a trace on first retry. After a failing run:

```bash
npx playwright show-trace test-results/<failed-test-dir>/trace.zip
```

The trace viewer shows DOM snapshots, network, and console per step. For interactive debugging use `npx playwright test --ui` or `--debug`. Common causes of smoke-spec failure:

- **Preview server not serving the latest build:** the spec runs against `vite preview` on port 4173, which serves `dist/`. Rebuild with `npm run build` after changing source.
- **Port 4173 already in use:** locally the config reuses an existing server, so a stale preview process can serve an old build. Kill it and rerun.
- **Changed testids or copy:** the spec asserts on `data-testid` values and specific strings such as "5 results" and the landing tagline from `src/config/brand.ts`. Update both sides together; see the data-testid contract in [testing](testing.md).

## Running a single test

```bash
npx vitest run src/test/analytics.test.ts        # one unit test file
npx vitest run -t "test name substring"          # one test by name
npx playwright test -g "landing to complete"     # one e2e test by title
```

For the full gate these feed into, see [development workflow](development-workflow.md).
