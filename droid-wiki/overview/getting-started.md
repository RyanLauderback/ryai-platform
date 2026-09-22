# Getting started

Corvex Console runs entirely locally with mock data. You need Node.js 20 or newer and npm.

## Install and run

```bash
cp .env.example .env
npm ci
npx playwright install chromium
npm run dev
```

Open `http://localhost:5173`. Sign in with any valid email and a nonempty password, or select **Continue with demo account** to land directly on the dashboard.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm test` | Run the Vitest unit/integration suite once |
| `npm run test:coverage` | Run tests with the 70% statement/line coverage gate |
| `npm run build` | Typecheck and build production assets into `dist/` |
| `npm run preview` | Serve the production build locally on port 4173 |
| `npm run test:e2e` | Run the Playwright Chromium smoke test against the preview build |
| `npm run prepare` | Install Husky Git hooks (runs automatically after `npm ci`) |

## Environment variables

Only one variable matters, and it is defined in `.env.example`:

- `VITE_ENABLE_MOCKS` (default `true`) — starts the MSW service worker so all `/api/*` requests are answered by local fixtures. Set it to `false` only when replacing MSW with a compatible real backend.

Because Vite inlines `import.meta.env` values at build time, changing this flag requires a rebuild.

## Verifying a change

The same gates that run in CI (`.github/workflows/ci.yml`) are available locally:

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build && npm run test:e2e
```

`npm run test:e2e` builds on `vite preview`, so run `npm run build` first or let the Playwright web server reuse a running preview (`playwright.config.ts`).

## Deploying

The app deploys to Netlify as a static site. See [Deployment](../deployment.md) for the exact UI steps and the SPA redirect configuration in `netlify.toml`.
