# Dashboard

Active contributors: RyanLauderback

The dashboard is the console home page at `/app`, rendered by `src/pages/app/DashboardPage.tsx`. It shows a personalized greeting, four 30-day KPI cards, a Recharts area chart of daily AI queries, a static recent-activity feed, and quick-action tiles that deep-link into the assistant.

## Purpose

The dashboard gives the signed-in demo user an at-a-glance summary of workspace activity. It is the primary consumer of the `/api/usage` endpoint and demonstrates the standard page pattern: `PageHeader`, KPI `Card` grid, chart, and feed.

## Key abstractions

| Abstraction | File | Description |
| --- | --- | --- |
| `DashboardPage` | `src/pages/app/DashboardPage.tsx` | Page component; fetches usage data and composes all sections. Root element carries `data-testid="dashboard-page"`. |
| `PageHeader` | `src/components/PageHeader.tsx` | Shared title/description/actions header used by every console page. |
| `api.usage` | `src/lib/api.ts` | Fetch wrapper for `GET /api/usage`. |
| `formatNumber` | `src/lib/utils.ts` | Number formatting for KPI values. |
| `brand.console` | `src/config/brand.ts` | Greeting string and three `quickPrompts`. |

## How it works

```mermaid
flowchart LR
    A[DashboardPage] -->|useQuery ['usage']| B[api.usage]
    B -->|GET /api/usage| C[MSW handler]
    C -->|usage fixture| D[src/mocks/data.ts]
    A -->|user name| E[useAuthStore]
    A -->|greeting and quickPrompts| F[brand.console]
```

The page fetches the full usage series with `useQuery({ queryKey: ["usage"], queryFn: api.usage })` and keeps only the last 30 days via `data.slice(-30)`. That slice drives two things:

1. KPI cards. The first three cards sum `queries`, `documents`, and `tokens` across the 30 days and format the totals with `formatNumber`. The fourth card, "Active teammates", is hard-coded to 14. Each card shows a fixed change badge (`+18%`, `+12%`, `+24%`, `+2`) and a Lucide icon on a `brand-50` tile. Cards lay out in a `sm:grid-cols-2 xl:grid-cols-4` grid.
2. Research activity chart. A Recharts `AreaChart` inside `ResponsiveContainer` plots daily `queries` with a brand-blue gradient fill (`#356df3`, fading to transparent), a hidden-tick X axis of dates, and a tooltip. The chart sits in a `1.5fr` column next to the activity feed on `xl` screens.

The greeting is `PageHeader` title `${brand.console.greeting}, ${user?.name.split(" ")[0] || "Maya"}`, so it reads "Good morning, Maya" for the demo persona from the [authentication](authentication.md) store.

The recent activity feed is a static array in the page (brief generated, document indexed, monitor updated) rendered as a divided list with icons and relative times; it is not fetched.

Quick actions map `brand.console.quickPrompts` to tiles linking to `/app/assistant?prompt=<encoded>`, which the [AI assistant](assistant.md) reads to prefill a question.

## Integration points

- Usage data comes from the [mock API](mock-api.md) handler for `GET /api/usage`.
- The greeting depends on the user stored by [authentication](authentication.md).
- Copy (greeting, quick prompts) comes from the [brand system](brand-system.md).
- `PageHeader` is shared with the [explorer](explorer.md), [analytics](analytics.md), [integrations](integrations.md), and [settings](settings.md) pages.

## Entry points for modification

- Change KPI definitions or the 30-day window: edit the `recent` slice, `totals` reduce, and `cards` array in `src/pages/app/DashboardPage.tsx`.
- Change greeting or quick prompts: edit `brand.console` in `src/config/brand.ts`.
- Change the chart: edit the `AreaChart` block (colors are hard-coded to `#356df3` there, not read from `brand.theme`).

## Key source files

| File | Role |
| --- | --- |
| `src/pages/app/DashboardPage.tsx` | Dashboard page component. |
| `src/components/PageHeader.tsx` | Shared page header. |
| `src/lib/api.ts` | `api.usage` fetch wrapper. |
| `src/mocks/handlers.ts` | `GET /api/usage` handler. |
| `src/mocks/data.ts` | Usage time-series fixture. |
| `src/config/brand.ts` | Greeting and quick prompts. |
