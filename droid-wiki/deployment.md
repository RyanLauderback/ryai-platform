# Deployment

Corvex Console deploys to Netlify as a static bundle. There is no server, database, or runtime secret to operate: the build output in `dist/` plus a client-side MSW service worker is the entire application.

## netlify.toml

`netlify.toml` at the repo root captures the whole deploy configuration:

- `build.command = "npm run build"` — typechecks and emits production assets.
- `build.publish = "dist"` — the directory Netlify serves.
- `build.environment` — pins `NODE_VERSION = "20"` and sets `VITE_ENABLE_MOCKS = "true"`.
- `[[redirects]]` — an SPA fallback rewriting `/*` to `/index.html` with status 200, so deep links like `/app/explorer` load the app instead of a Netlify 404.

## Netlify UI steps

The README documents the click-through setup:

1. Push the repo to a Git provider.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repository.
3. Set **Branch to deploy** to `main`.
4. Set **Build command** to `npm run build` and **Publish directory** to `dist`.
5. Add the environment variable `VITE_ENABLE_MOCKS=true`.
6. Confirm Node is 20 under build settings (already pinned by `netlify.toml`).
7. Deploy, then open `/app/explorer` directly to verify the SPA redirect works.

Netlify also builds deploy previews for pull requests, which is the easiest way to smoke-test a UI change before merge.

## The VITE_ENABLE_MOCKS requirement

The app has no real backend. `src/main.tsx` starts the MSW service worker only when `import.meta.env.VITE_ENABLE_MOCKS === "true"`, and `vite.config.ts` inlines that value at build time (defaulting to `"true"` when unset). If the variable is missing or `false` in the deploy environment, the built app makes real network requests to `/api/*`, which do not exist, and every console screen renders empty. Always keep it `true` for demo deploys.

## CI gate

Deployment assumes the `quality` job in `.github/workflows/ci.yml` is green: `npm ci`, lint, typecheck, coverage, build, and the Playwright smoke test on Node 20. Because `npm run build` runs in CI, a merge to `main` cannot contain a change that breaks the production build Netlify will run. See [development workflow](how-to-contribute/development-workflow.md) for the full gate and [configuration](reference/configuration.md) for environment variable semantics.
