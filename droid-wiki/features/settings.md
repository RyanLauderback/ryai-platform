# Settings

Active contributors: RyanLauderback

The settings page is a four-tab preferences surface covering profile, organization, plan and billing, and appearance. Almost everything is presentational: the only working control is the dark-mode switch.

## Purpose

Demonstrate a standard SaaS settings layout with the current user (from `GET /api/me`), a plan derived from brand pricing copy, usage-limit meters, and a theme toggle backed by a persisted Zustand store.

## Key abstractions

| File | Description |
| --- | --- |
| `src/pages/app/SettingsPage.tsx` | Page component with Radix Tabs and four tab panels |
| `src/store/theme.ts` | Zustand store (`dark`, `setDark`) persisted to localStorage key `corvex-theme` |
| `src/config/brand.ts` | `brand.pricing` tiers used to resolve the current plan |
| `src/lib/api.ts` | `api.me()` for the current user |
| `src/styles.css` | `.dark body { color-scheme: dark }` rule |

## How it works

`Tabs.Root` (Radix) renders a vertical trigger list on large screens (horizontal scroll on small) with four panels: Profile, Organization, Plan & billing, Appearance.

- **Profile**: inputs prefilled from the `["me"]` query (`user.name`, `user.email`) plus hardcoded job title and timezone. The Save button has no handler.
- **Organization**: organization name prefilled from `user.company`, a static workspace ID (`org_northstar_demo_1248`), and an inert Save button.
- **Plan & billing**: the plan is derived by matching `user.plan` ("Professional" from the mock `/api/me`) against `brand.pricing` tier names, falling back to `brand.pricing[1]`. The panel shows plan name, price/cadence, a hardcoded "8 seats" label, and three static usage-limit meters: AI queries 1,481 / 2,500, Seats 8 / 10, Private sources 12 / 25. None of these numbers come from the usage API.
- **Appearance**: a Radix Switch (`data-testid="theme-toggle"`) bound to `useThemeStore`. A `useEffect` toggles the `dark` class on `document.documentElement` whenever the store value changes.

### Dark mode is shallow

The toggle works and persists across reloads (`corvex-theme` in localStorage), but the visual effect is minimal: the codebase has very few `dark:` Tailwind utilities, and the only global dark rule in `src/styles.css` is `.dark body { color-scheme: dark }`, which mainly affects native form controls and scrollbars. Most surfaces stay light. See [Brand system](brand-system.md) for the theme tokens.

## Integration points

- Routed at `/app/settings` inside the authenticated console (see [Authentication](authentication.md)).
- User shape comes from `src/types/index.ts`; see [Data models](../reference/data-models.md).
- Plan copy is shared with the public pricing page through `brand.pricing` (see [Marketing site](marketing-site.md)).

## Entry points for modification

- Persist profile edits: add a mutation and a PATCH `/api/me` handler; inputs currently use uncontrolled `defaultValue`.
- Real usage meters: query `api.usage()` and derive counts instead of the hardcoded strings.
- Deepen dark mode: add `dark:` variants to components; the class plumbing already works.

## Key source files

| File | Role |
| --- | --- |
| `src/pages/app/SettingsPage.tsx` | Tabs and all four panels |
| `src/store/theme.ts` | Persisted dark-mode store |
| `src/config/brand.ts` | Pricing tiers for plan resolution |
| `src/styles.css` | `.dark` color-scheme rule |
| `src/lib/api.ts` | `me` client |
