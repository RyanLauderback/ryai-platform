# Tooling

Every build, test, lint, and deploy behavior is driven by a small set of root config files. This page lists each one with its purpose and notable settings. For how the pieces fit the contribution cycle, see [development workflow](development-workflow.md).

## Root config files

| File | Purpose |
| --- | --- |
| `vite.config.ts` | Vite 5 config via `vitest/config`: React plugin, `@` → `src` resolve alias, a `define` that inlines `import.meta.env.VITE_ENABLE_MOCKS` (defaulting to `"true"`) at build time, and the entire Vitest block (jsdom, globals, setup file, coverage provider/thresholds/exclusions). |
| `tsconfig.json` | Strict TypeScript: `strict: true`, ES2022 target and libs, `moduleResolution: "Bundler"`, `jsx: react-jsx`, `noEmit`, plus the `@/*` → `./src/*` path alias and types for `vite/client`, `vitest/globals`, jest-dom, and node. Includes `src`, both config TS files, and `e2e`. |
| `tailwind.config.ts` | Tailwind with `darkMode: "class"`, content globs for `index.html` and `src/**/*.{ts,tsx}`, and the brand palette extension (`ink`, `brand` scale, `mint`, soft shadow, Inter font). |
| `postcss.config.js` | PostCSS pipeline: `tailwindcss` plus `autoprefixer`. |
| `eslint.config.js` | Flat ESLint config: JS and typescript-eslint recommended sets, react-hooks rules, react-refresh export rule, unused-vars error with `_` prefix exemption, `eslint-config-prettier` last to disable formatting rules, and ignores for `dist`, `coverage`, `playwright-report`, `test-results`, and `public/mockServiceWorker.js`. |
| `.prettierrc` | Prettier: semicolons, double quotes, trailing commas, 100-column width. |
| `commitlint.config.js` | Extends `@commitlint/config-conventional`; invoked by `.husky/commit-msg`. |
| `playwright.config.ts` | E2E runner: `e2e/` test dir, base URL `http://127.0.0.1:4173`, trace on first retry, CI-only retries, and a `webServer` that starts `vite preview`. Single Chromium project. |
| `netlify.toml` | Netlify deploy: build command `npm run build`, publish `dist`, Node 20 and `VITE_ENABLE_MOCKS=true` environment, and the SPA redirect `/*` → `/index.html` with status 200. |
| `.env.example` | Documents the one environment variable, `VITE_ENABLE_MOCKS=true`. Copy to `.env` for local dev. |
| `package.json` | Beyond scripts and dependencies, carries `engines: node >=20`, the `lint-staged` map (ESLint/Prettier on staged TS/TSX, Prettier on staged JSON/MD/CSS/YAML), and the `msw.workerDirectory: ["public"]` setting that places the service worker script in `public/`. |

## Editor-facing behavior

- Prettier is the only formatter; ESLint defers to it through `eslint-config-prettier`, so formatting disputes should be settled by running `npx prettier --write`.
- The `@/` alias works in TypeScript, Vitest, and Vite builds because it is declared in both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`). Playwright files import only from `@playwright/test`, so they do not need the alias.
- `npm run lint` passes `--max-warnings=0`, so warnings (for example from `react-refresh/only-export-components`) fail the gate, not just errors.

Related: [testing](testing.md) for the Vitest block details, [configuration](../reference/configuration.md) for runtime configuration values, and [deployment](../deployment.md) for the Netlify side.
