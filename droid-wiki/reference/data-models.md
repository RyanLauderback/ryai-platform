# Data models

All domain types are exported from `src/types/index.ts`. They describe exactly what the MSW mock API in `src/mocks/handlers.ts` returns, since there is no other backend. Fixture values live in `src/mocks/data.ts`.

## Types

| Type | Fields |
| --- | --- |
| `User` | `id: string`, `name: string`, `email: string`, `company: string`, `plan: string` |
| `Document` | `id: string`, `title: string`, `company: string`, `sector: string`, `source: string`, `date: string`, `excerpt: string`, `body: string`, `tags: string[]` |
| `UsageDay` | `date: string`, `queries: number`, `documents: number`, `tokens: number`, `activeUsers: number` |
| `ApiKey` | `id: string`, `name: string`, `prefix: string`, `createdAt: string`, `lastUsed: string`, `secret?: string` (present only in the create response) |
| `Connector` | `id: string`, `name: string`, `description: string`, `status: "connected" \| "available"`, `category: string` |
| `Webhook` | `id: string`, `url: string`, `event: string`, `active: boolean` |
| `AgentResponse` | `answer: string`, `citations: { id: string; title: string }[]` |

Dates are ISO-ish strings (`createdAt` is generated with `toISOString().slice(0, 10)`); there are no branded date types.

## Mock endpoint inventory

All endpoints are defined in `src/mocks/handlers.ts` and served in-browser by `src/mocks/browser.ts` or in tests by `src/mocks/server.ts`.

| Endpoint | Request | Response payload |
| --- | --- | --- |
| `GET /api/me` | — | `User` (hardcoded demo user) |
| `GET /api/usage` | — | `UsageDay[]` |
| `GET /api/documents` | Query params `q`, `sector`, `source`, `range` | `Document[]` filtered by text, sector, source, and a date window anchored to `"2024-12-31"` |
| `GET /api/documents/:id` | — | `Document`, or `{ message }` with status 404 |
| `POST /api/agent/query` | `{ query: string }` | `AgentResponse` after a 120 ms delay; citations are the first three documents |
| `GET /api/keys` | — | `ApiKey[]` |
| `POST /api/keys` | `{ name: string }` | `ApiKey` with `secret` included, status 201 |
| `DELETE /api/keys/:id` | — | `{ success: true }` |
| `GET /api/connectors` | — | `Connector[]` |
| `POST /api/connectors` | `{ id: string }` | `Connector[]` with the target connector's `status` toggled |
| `GET /api/webhooks` | — | `Webhook[]` |
| `POST /api/webhooks` | `{ url: string }` | `Webhook[]` with a new `document.created` webhook appended |

Keys, connectors, and webhooks are held in module-level mutable arrays; `resetMockData()` restores them from `src/mocks/data.ts` between tests (see [testing](../how-to-contribute/testing.md)).

The known mismatch between the Explorer deep link and the Assistant page (`?document=` versus `?prompt=`) is documented in [cleanup opportunities](../cleanup-opportunities.md).
