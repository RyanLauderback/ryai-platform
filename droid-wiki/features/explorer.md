# Data explorer

Active contributors: RyanLauderback

The data explorer at `/app/explorer` is a searchable document library with sector, source, and date-range filters, match highlighting, and a two-pane results/viewer layout. It supports deep links via `?document=<id>` and hands off to the assistant with an "Ask assistant about this" link.

## Purpose

The explorer demonstrates a research workflow over the mocked document corpus: filter and search a result list on the left, read a selected document on the right. All filtering happens server-side in the MSW handler, so the page exercises real query-string-driven fetching rather than client-side filtering.

## Key abstractions

| Abstraction | File | Description |
| --- | --- | --- |
| `ExplorerPage` | `src/pages/app/ExplorerPage.tsx` | Page component managing filter state, the results query, and selection. Root element carries `data-testid="explorer-page"`. |
| `Highlight` | `src/pages/app/ExplorerPage.tsx` | Local component that wraps the first case-insensitive query match in a `<mark class="bg-yellow-200">`. |
| `api.documents` / `api.document` | `src/lib/api.ts` | Fetch wrappers for `GET /api/documents` and `GET /api/documents/:id`. |
| Documents handler | `src/mocks/handlers.ts` | Implements `q`, `sector`, `source`, and `range` filtering over the fixtures. |
| `PageHeader` | `src/components/PageHeader.tsx` | Shared page header. |

## How it works

```mermaid
flowchart LR
    A[Filter state q, sector, source, range] -->|useMemo query string| B[useQuery documents, params]
    B -->|GET /api/documents?...| C[MSW handler filtering]
    C --> D[Result list with Highlight]
    D -->|select| E[useQuery document, activeId]
    E -->|GET /api/documents/:id| F[Document viewer pane]
    F -->|Ask assistant about this| G[/app/assistant?document=id]
```

Filter state (`query`, `sector`, `source`, `range`) is local `useState`. A `useMemo` builds a query string from non-default values, and `useQuery({ queryKey: ["documents", params], ... })` refetches whenever it changes. The toolbar has a search input (`data-testid="explorer-search"`) plus three native selects: sector (Software, Semiconductors, Energy, Healthcare, Financials, Automotive), source (Earnings call, SEC filing, Expert interview, Industry report), and date range (all/30/90/180 days). A result count (`data-testid="result-count"`) shows "Searching…" while loading.

In `src/mocks/handlers.ts`, `GET /api/documents` lowercases the `q` param and matches it against `title + excerpt + company`, filters `sector` and `source` by exact equality, and computes `range` relative to a fixed anchor date `2024-12-31` (so the demo data never goes stale against the current clock).

Selection works in two steps. `selectedId` initializes from `useSearchParams().get("document")`, enabling deep links such as `/app/explorer?document=doc-3`. The effective `activeId` falls back to the first result when `selectedId` is null or not in the current filtered list, so the viewer always shows something relevant. A second query, `useQuery({ queryKey: ["document", activeId], enabled: Boolean(activeId) })`, fetches the full document for the viewer pane.

The layout is a two-pane grid (`xl:grid-cols-[minmax(340px,.9fr)_1.4fr]`, `min-h-[600px]`). Result cards show a source `Badge`, date, highlighted title and two-line excerpt, and company/sector metadata; the active card gets a brand ring. An empty state ("No sources match these filters.") appears when filtering yields nothing. The right pane is `xl:sticky` and renders the document with badge, date, company/sector strip, body paragraphs split on blank lines, tag badges, and a button linking to `/app/assistant?document=<id>` for the [AI assistant](assistant.md). With no selection it shows a "Select a document to preview" placeholder. Highlighting only marks the first match per text field.

## Integration points

- Document data and filtering come from the [mock API](mock-api.md); fixtures live in `src/mocks/data.ts`.
- The viewer links into the [AI assistant](assistant.md) via `?document=<id>`, and the assistant's citations link back here.
- Shares `PageHeader` and `Card`/`Badge`/`Input` primitives with the [dashboard](dashboard.md) and other console pages.

## Entry points for modification

- Add a filter: add state in `src/pages/app/ExplorerPage.tsx`, extend the `params` memo, and handle the new param in the `GET /api/documents` handler in `src/mocks/handlers.ts`.
- Change highlighting (for example, mark all matches): edit the `Highlight` component.
- Change fallback selection behavior: edit the `activeId` derivation.
- Change the date-range anchor: edit the `2024-12-31` constant in the handler.

## Key source files

| File | Role |
| --- | --- |
| `src/pages/app/ExplorerPage.tsx` | Explorer page and `Highlight` component. |
| `src/mocks/handlers.ts` | `GET /api/documents` and `GET /api/documents/:id` handlers. |
| `src/mocks/data.ts` | Document fixtures. |
| `src/lib/api.ts` | `api.documents` and `api.document` wrappers. |
| `src/components/PageHeader.tsx` | Shared page header. |
