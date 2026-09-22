# Corvex Console overview

Corvex Console is a production-shaped static single-page application for **Corvex Intelligence**, a fictional market-intelligence company. It demonstrates two surfaces in one Vite/React codebase: a public marketing site (landing and pricing pages) and a mock-authenticated product console with a dashboard, research explorer, cited AI assistant, integrations management, usage analytics, and settings.

Everything dynamic is fake by design. There is no backend, database, or auth server — MSW (Mock Service Worker) intercepts every `/api/*` request in the browser and answers from deterministic fixtures in `src/mocks/data.ts`. The repository exists to model real engineering workflows (branching, testing, CI, PRs) on top of a fully static deployable artifact.

## Who uses this repository

- **Demo presenters** showing an AlphaSense-style product without standing up infrastructure.
- **Automated contributors** (such as Factory Droid) picking up small UI tickets against a clean, well-tested codebase.
- **Engineers** evaluating a reference React 18 + TypeScript + Tailwind + MSW setup.

## Quick links

- [Architecture](architecture.md) — how the SPA, router, MSW layer, and stores fit together
- [Getting started](getting-started.md) — install, run, test, and deploy
- [Glossary](glossary.md) — project-specific vocabulary
- [Features](../features/index.md) — marketing site, console pages, and the mock API
- [How to contribute](../how-to-contribute/index.md) — branch strategy, commit rules, PR process
- [Deployment](../deployment.md) — Netlify static hosting and CI quality gate

## Ground rules

All companies, people, credentials, endpoints, and product claims are fictional demo content (stated in `README.md` and `src/config/brand.ts`). API secrets shown in the UI are inert strings, and the login form accepts any email with a nonempty password. Never adapt the fake authentication for production use.
