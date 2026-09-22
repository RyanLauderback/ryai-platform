# Dependencies

All dependencies are declared in `package.json` (versions below are the declared ranges). Node `>=20` is required via `engines`.

## Runtime dependencies

| Purpose | Package | Version |
| --- | --- | --- |
| Framework | `react`, `react-dom` | ^18.3.1 |
| Routing | `react-router-dom` | ^6.28.1 |
| Server state | `@tanstack/react-query` | ^5.62.7 |
| Client state | `zustand` | ^5.0.2 |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | ^7.54.2, ^3.9.1, ^3.24.1 |
| UI primitives (Radix) | `@radix-ui/react-dialog` | ^1.1.4 |
| | `@radix-ui/react-slot` | ^1.1.1 |
| | `@radix-ui/react-switch` | ^1.1.2 |
| | `@radix-ui/react-tabs` | ^1.1.2 |
| | `@radix-ui/react-dropdown-menu` (unused) | ^2.1.4 |
| | `@radix-ui/react-label` (unused) | ^2.1.1 |
| Styling utilities | `class-variance-authority`, `clsx`, `tailwind-merge` | ^0.7.1, ^2.1.1, ^2.6.0 |
| Icons | `lucide-react` | ^0.468.0 |
| Charts | `recharts` | ^2.15.0 |
| Dates | `date-fns` | ^4.1.0 |
| API mocking | `msw` | ^2.7.0 |

### Unused packages

`@radix-ui/react-dropdown-menu` and `@radix-ui/react-label` have no imports anywhere under `src/` (confirmed by grep). Pages use raw `@radix-ui/react-switch` and `@radix-ui/react-tabs` instead of wrappers, and the wrapped components in `src/components/ui/` use only dialog and slot. Removal is tracked in [cleanup opportunities](../cleanup-opportunities.md).

## Dev dependencies

| Purpose | Package | Version |
| --- | --- | --- |
| Build | `vite`, `@vitejs/plugin-react` | ^5.4.11, ^4.3.4 |
| Language | `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | ~5.6.3, ^22.10.2, ^18.3.18, ^18.3.5 |
| Unit testing | `vitest`, `@vitest/coverage-v8`, `jsdom` | ^2.1.8, ^2.1.8, ^25.0.1 |
| Component testing | `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` | ^16.1.0, ^6.6.3, ^14.5.2 |
| E2E testing | `@playwright/test` | ^1.49.1 |
| Linting | `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`, `globals` | ^9.17.0, ^9.17.0, ^8.18.1, ^5.1.0, ^0.4.16, ^9.1.0, ^15.14.0 |
| Formatting | `prettier` | ^3.4.2 |
| CSS build | `tailwindcss`, `postcss`, `autoprefixer` | ^3.4.17, ^8.4.49, ^10.4.20 |
| Git hooks | `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional` | ^9.1.7, ^15.3.0, ^19.6.1, ^19.6.0 |

Notable: `msw` is a runtime dependency (not dev) because the service worker ships with the production demo build; the `msw.workerDirectory` setting in `package.json` places `mockServiceWorker.js` in `public/`. For how these tools are configured, see [tooling](../how-to-contribute/tooling.md) and [configuration](configuration.md).
