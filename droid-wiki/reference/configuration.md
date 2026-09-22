# Configuration

The app has one runtime-affecting environment variable and a handful of build-time settings. Everything is static; there is no server-side configuration. For the files behind these settings, see [tooling](../how-to-contribute/tooling.md).

## VITE_ENABLE_MOCKS

The only environment variable. `.env.example` contains exactly `VITE_ENABLE_MOCKS=true`; copy it to `.env` for local development.

- **Semantics:** when `"true"`, `src/main.tsx` starts the MSW service worker from `src/mocks/browser.ts` and all `/api/*` requests are served from mock handlers. When anything else, no mocking starts and the app issues real network requests.
- **Default:** `vite.config.ts` defines `import.meta.env.VITE_ENABLE_MOCKS` as `JSON.stringify(process.env.VITE_ENABLE_MOCKS ?? "true")`, so it defaults to `"true"` even with no `.env` file.
- **Build-time inlining:** because the value is injected through Vite's `define`, it is a compile-time constant, not read from `import.meta.env` at runtime. Changing it requires a rebuild; there is no runtime toggle.
- **Deploys:** `netlify.toml` sets it to `"true"` in the build environment. Setting it to `false` only makes sense when a compatible real backend exists; see [security](../security.md).

## netlify.toml build settings

| Setting | Value |
| --- | --- |
| `build.command` | `npm run build` |
| `build.publish` | `dist` |
| `build.environment.NODE_VERSION` | `20` |
| `build.environment.VITE_ENABLE_MOCKS` | `true` |
| Redirect | `/*` → `/index.html`, status 200 (SPA fallback) |

Details in [deployment](../deployment.md).

## Path alias `@/*`

`@` maps to `src/` in two places that must stay in sync: `compilerOptions.paths` in `tsconfig.json` (`"@/*": ["./src/*"]`) and `resolve.alias` in `vite.config.ts`. Imports like `@/mocks/handlers` work in app code, tests, and both config TS files.

## Tailwind dark mode

`tailwind.config.ts` sets `darkMode: "class"`, so dark styles activate when a `dark` class is present on an ancestor element. The theme extension adds the brand palette (`ink`, `brand` 50–700, `mint`), a `soft` box shadow, and the Inter font stack. Note that almost no `dark:` utilities are applied in the UI today; the Settings theme toggle persists a `dark` flag via `src/store/theme.ts` but has little visible effect. Tracked in [cleanup opportunities](../cleanup-opportunities.md).

## npm scripts

From `package.json`: `dev`, `lint`, `typecheck`, `test`, `test:coverage`, `test:e2e`, `build`, `preview`, and `prepare` (installs Husky hooks on install). Node `>=20` is required via `engines`. Command purposes are also tabulated in the README and in [getting started](../overview/getting-started.md).
