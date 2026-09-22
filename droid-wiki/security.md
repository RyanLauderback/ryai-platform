# Security

Corvex Console is a fictional demo. Every trust boundary in it is intentionally fake, and nothing here is production-safe. This page exists so nobody mistakes the demo mechanics for real security controls.

## What is fake by design

- **Authentication:** `src/pages/AuthPage.tsx` accepts any valid email and any nonempty password. `src/store/auth.ts` derives a display name from the email and stores a fake session in `localStorage` under the `corvex-auth` key. There is no credential check, token signing, or expiry that means anything.
- **API keys:** keys created on the Integrations page are generated in `src/mocks/handlers.ts` with predictable prefixes like `cvx_live_0031` and a hardcoded `_demo_secret_reveal_once` suffix. They authorize nothing and are safe to screenshot.
- **Data:** all `/api/*` responses come from MSW handlers and seeded fixtures in `src/mocks/data.ts`. No request leaves the browser at runtime.

## Real properties worth knowing

- The app makes no external network calls at runtime; MSW intercepts everything in-browser. That means the deployed demo cannot leak user data to a third party, because there is no third party.
- Because the "session" is just a `localStorage` flag, anyone with DevTools can grant themselves access. Treat every deployed preview as fully public.

## What production would require

Replacing the demo layer, in order of dependency:

1. A real identity provider (OIDC/SAML) and server-issued, short-lived tokens instead of the localStorage flag.
2. A real API behind authentication and authorization, with MSW retained only for tests and local development (toggle via `VITE_ENABLE_MOCKS`; see [configuration](reference/configuration.md)).
3. Real secret handling: server-generated API keys, hashed at rest, never returned in full after creation.
4. Standard hygiene the static bundle cannot provide on its own: CSP headers, rate limiting, and audit logging at the API layer.

For how the mock layer fits the app, see [architecture](overview/architecture.md); for deployment posture, see [deployment](deployment.md).
