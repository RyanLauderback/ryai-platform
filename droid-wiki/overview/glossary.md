# Glossary

Project-specific terms used across the codebase and this wiki.

**Brand tokens** — The centralized copy and theme values in `src/config/brand.ts`: company and product names, tagline, hero copy, feature modules, pricing tiers, and the hex palette (`ink` `#0d1526`, `brand` `#356df3`, `mint` `#56d6b1`). Marketing copy changes belong here, not in components.

**Citations** — Document references returned by the mock `POST /api/agent/query` endpoint and rendered by the assistant as links back into the explorer. They demonstrate the "auditable output" story of the fictional product.

**`cn()`** — The class-name combiner in `src/lib/utils.ts` (`clsx` + `tailwind-merge`), used by all `src/components/ui/` primitives.

**Connectors** — Third-party integrations (Slack, Snowflake, Salesforce, Google Drive, S3) with `connected` or `available` status, managed on the integrations page.

**Corvex Intelligence** — The fictional company. **Corvex Console** is the product name. Both come from `brand.company` and `brand.product` in `src/config/brand.ts`.

**Demo account** — The one-click sign-in (`data-testid="demo-login"`) that authenticates as the fixed persona Maya Chen at Northstar Capital on the Professional plan. Defined in `src/store/auth.ts`.

**MCP (Model Context Protocol)** — The fictional `https://mcp.corvex.example/sse` server advertised on the integrations page with a copy-ready JSON config block.

**MSW (Mock Service Worker)** — The library that intercepts `/api/*` requests. It runs as a service worker in the browser (`src/mocks/browser.ts`) and as a Node server in tests (`src/mocks/server.ts`).

**`resetMockData()`** — Test helper exported from `src/mocks/handlers.ts` that restores mutable handler state (keys, connectors, webhooks) to the seeded fixtures. Called between tests in `src/test/setup.ts`.

**Reveal-once secret** — The API key secret returned only by the create-key endpoint and shown in a one-time dialog. The string (for example `cvx_live_..._demo_secret_reveal_once`) is inert.

**Usage day** — One row of the seeded 90-day time series in `src/mocks/data.ts` (`UsageDay` in `src/types/index.ts`): queries, API calls, tokens, and credits consumed per day.

**`VITE_ENABLE_MOCKS`** — The only environment flag. Defaults to `true`; when `false`, MSW does not start and the app would need a real backend. See [Configuration](../reference/configuration.md).
