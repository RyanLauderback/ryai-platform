# Features

Active contributors: RyanLauderback

Corvex Console ships two feature sets: a public marketing site and a guarded console application with five pages. Every feature is driven by centralized brand copy in `src/config/brand.ts` and mocked data served by MSW, so no backend is required to run or demo any of them.

## Child pages

| Page | Description |
| --- | --- |
| [Brand system](brand-system.md) | Central copy, theme tokens, and logo, designed so a product rename is a one-file edit. |
| [Marketing site](marketing-site.md) | Public landing and pricing pages composed from section components. |
| [Authentication](authentication.md) | Intentionally fake login/signup with a demo persona and route guarding. |
| [Dashboard](dashboard.md) | Console home with 30-day KPI cards, an activity sparkline, and quick prompts. |
| [Data explorer](explorer.md) | Searchable document library with filters, highlighting, and a two-pane viewer. |
| [AI assistant](assistant.md) | Chat interface with streaming-style answers and citations back to explorer documents. |
| [Integrations](integrations.md) | API keys, MCP connectors, and webhooks backed by mutable mock state. |
| [Usage analytics](analytics.md) | Recharts dashboards fed by transforms over `/api/usage` data. |
| [Settings](settings.md) | Profile, organization, plan, and appearance tabs. |
| [Mock API and data layer](mock-api.md) | MSW handlers and fixtures that stand in for every backend endpoint. |

## How the features fit together

The marketing site routes (`/`, `/pricing`) render inside `PublicLayout`. The auth routes (`/login`, `/signup`) render the standalone `AuthPage`. Everything under `/app/*` passes through `RequireAuth` and `ConsoleLayout` and renders one of the console pages. See [System architecture](../overview/architecture.md) for the full route table.

All console pages follow the same data flow: the page calls a function in `src/lib/api.ts` inside a TanStack Query `useQuery`, which fetches a path intercepted by an MSW handler in `src/mocks/handlers.ts` that returns fixtures from `src/mocks/data.ts`. Details live in [Mock API and data layer](mock-api.md).
