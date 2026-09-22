# Brand system

Active contributors: RyanLauderback

All marketing copy, pricing tiers, product modules, and theme colors live in a single module, `src/config/brand.ts`. Components never hard-code brand strings; they read from the `brand` object so a full product rename is a one-file edit.

## Purpose

Corvex Console is a portfolio demonstration for a fictional company, so the brand is expected to change. The design goal is that renaming the company, product, or palette touches only `src/config/brand.ts` (and, for Tailwind classes, `tailwind.config.ts`). Tests reinforce this by asserting against `brand` values rather than literal strings.

## Key abstractions

| Abstraction | File | Description |
| --- | --- | --- |
| `brand` | `src/config/brand.ts` | Const object holding company, product, tagline, theme colors, nav links, hero copy, modules, customers, testimonial, pricing, auth labels, and console prompts. |
| `PricingTier` | `src/config/brand.ts` | Type for a pricing tier: name, price, optional cadence, description, CTA, optional `featured` flag, feature list. |
| `Module` | `src/config/brand.ts` | Type for a product module: title, description, and a Lucide icon component. |
| Tailwind palette | `tailwind.config.ts` | Mirrors the brand tokens as utility colors (`brand`, `ink`, `mint`). |
| `Logo` | `src/components/Logo.tsx` | Inline SVG wordmark whose gradient stops read `brand.theme.primary` and `brand.theme.mint`. |

## How it works

`src/config/brand.ts` exports `brand` with `as const`, so every string is literal-typed and safe to compare in tests. Notable fields:

- `theme`: `primary` `#356df3`, `ink` `#0d1526`, `mint` `#56d6b1`, `surface` `#f7f9fc`.
- `modules`: six product modules (Generative Search, Deep Research, Workflow Agents, Financial Data, Monitoring, Connectors & API), each with a Lucide icon. Rendered by the marketing [FeatureGrid](../features/marketing-site.md).
- `pricing`: three tiers (Starter $49, Professional $149 featured, Enterprise custom) consumed by both the pricing page and the landing teaser.
- `console.quickPrompts`: seed prompts used by the [Dashboard](dashboard.md) quick-action tiles.
- `auth`: titles and the demo-button label used by [Authentication](authentication.md).
- `legal`: the disclaimer that Corvex Intelligence is fictional, rendered in the footer.

`tailwind.config.ts` mirrors the theme tokens as utility classes: `ink` (`#0d1526`), `mint` (`#56d6b1`), and a `brand` scale (`50`, `100`, `500`, `600`, `700`) centered on `brand-500: #356df3`. It also sets the Inter font stack and a `shadow-soft` token. `src/styles.css` adds base Tailwind layers, smooth scrolling, a `dark` class hook for `color-scheme`, and a `prefers-reduced-motion` reset.

`src/components/Logo.tsx` renders an inline SVG hexagon mark with a `linearGradient` from `brand.theme.primary` to `brand.theme.mint`, plus the `brand.product` wordmark unless `compact` is set. A `light` prop switches the wordmark to white for dark backgrounds.

Tests in `src/test/app.test.tsx` assert against `brand.tagline`, `brand.product`, each entry of `brand.modules`, and `brand.auth.loginTitle`, so renaming the brand updates the tests automatically.

## Integration points

- [Marketing site](marketing-site.md) reads hero, modules, customers, testimonial, pricing, nav, and legal copy.
- [Authentication](authentication.md) reads `brand.auth` and shows `brand.tagline` on the split panel.
- [Dashboard](dashboard.md) reads `brand.console.greeting` and `brand.console.quickPrompts`.

## Entry points for modification

- Rename the company or product: edit `company`, `product`, and `tagline` in `src/config/brand.ts`.
- Change the palette: edit `theme` in `src/config/brand.ts` and the matching colors in `tailwind.config.ts` (both are needed; the Tailwind scale is a manual mirror).
- Change pricing or modules: edit the `pricing` and `modules` arrays in `src/config/brand.ts`; all consumers render them dynamically.

## Key source files

| File | Role |
| --- | --- |
| `src/config/brand.ts` | Single source of truth for copy and theme tokens. |
| `tailwind.config.ts` | Tailwind color/font/shadow tokens mirroring the brand palette. |
| `src/styles.css` | Global base styles and reduced-motion handling. |
| `src/components/Logo.tsx` | Inline SVG logo bound to brand theme colors. |
| `src/test/app.test.tsx` | Tests that assert against `brand` values. |
