# Corvex Console

A production-shaped static SPA for **Corvex Intelligence**, a fictional market-intelligence company. Corvex Console demonstrates public marketing, mock authentication, source exploration, a cited research assistant, API/integration management, and usage analytics. All companies, people, credentials, endpoints, and product claims are fictional demo content.

## Stack

- Vite, React 18, strict TypeScript, React Router v6
- Tailwind CSS and shadcn-style components backed by Radix primitives
- TanStack Query, Zustand, MSW, and Recharts
- Vitest, React Testing Library, and Playwright
- ESLint, Prettier, Husky, lint-staged, and commitlint

No runtime service, external API, secret, or account is required. MSW serves the complete data layer in-browser.

## Quickstart

Requirements: Node.js 20+ and npm.

```bash
cp .env.example .env
npm ci
npx playwright install chromium
npm run dev
```

Open `http://localhost:5173`. Sign in with any valid email and nonempty password, or select **Continue with demo account**.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Run ESLint with zero warnings |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm test` | Run unit/integration tests once |
| `npm run test:coverage` | Run tests with 70% statement/line thresholds |
| `npm run build` | Typecheck and build production assets |
| `npm run preview` | Preview the production build |
| `npm run test:e2e` | Run the Playwright Chromium smoke test against preview |
| `npm run prepare` | Install Husky Git hooks |

Set `VITE_ENABLE_MOCKS=false` only when replacing MSW with a compatible backend. It defaults to `true` for local and deployed demo builds.

## Netlify UI deployment

1. Push this directory to a new Git repository.
2. Sign in to Netlify and choose **Add new site → Import an existing project**.
3. Select the Git provider and this repository.
4. Set **Branch to deploy** to `main`.
5. Set **Build command** to `npm run build`.
6. Set **Publish directory** to `dist`.
7. Under **Environment variables**, add `VITE_ENABLE_MOCKS` with value `true`.
8. Under **Build settings → Environment**, confirm Node is `20` (the included `netlify.toml` also sets it).
9. Choose **Deploy site**.
10. After deploy, open `/app/explorer` directly to verify the included SPA redirect fallback.

## Architecture notes

- `src/config/brand.ts` is the single source for company, product, marketing copy, theme, feature, and pricing tokens.
- `src/mocks/data.ts` contains deterministic demo fixtures; `src/mocks/handlers.ts` owns every dynamic endpoint.
- Authentication is deliberately fake and persisted locally by Zustand. Never adapt the token behavior for production.
- API secrets shown in the UI are inert demo strings.
