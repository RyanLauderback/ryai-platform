# Marketing site

Active contributors: RyanLauderback

The public marketing site consists of two routes, `/` and `/pricing`, rendered inside `PublicLayout` and composed entirely from small section components that read copy from the [brand system](brand-system.md). It is fully static and requires no authentication or data fetching.

## Purpose

The marketing site presents the fictional Corvex Intelligence product: a hero with a mocked product screenshot, a logo cloud, a six-module feature grid, a testimonial, pricing teasers, and a full pricing page. All copy is fictional and comes from `src/config/brand.ts`.

## Directory layout

```
src/marketing/
  Landing.tsx            # / route, stacks the section components
  Pricing.tsx            # /pricing route, full pricing grid
  PricingTierCard.tsx    # shared tier card (full and teaser variants)
  sections/
    Hero.tsx             # headline, CTAs, product preview
    ProductPreview.tsx   # static mock of the console UI
    LogoCloud.tsx        # fictional customer names
    FeatureGrid.tsx      # six modules from brand.modules
    Testimonial.tsx      # single quote on dark background
    PricingTeaser.tsx    # condensed pricing cards on landing
    CTA.tsx              # closing call-to-action banner
    Footer.tsx           # logo, legal line, links
src/layouts/
  PublicLayout.tsx       # sticky header with nav and auth buttons
```

## Key abstractions

| Abstraction | File | Description |
| --- | --- | --- |
| `PublicLayout` | `src/layouts/PublicLayout.tsx` | Sticky header with `Logo`, nav from `brand.nav`, login/signup buttons, mobile hamburger menu, and an `<Outlet />`. |
| `Landing` | `src/marketing/Landing.tsx` | Composes Hero, LogoCloud, FeatureGrid, Testimonial, PricingTeaser, CTA, Footer in order. |
| `Pricing` | `src/marketing/Pricing.tsx` | Header copy plus a three-column grid of full `PricingTierCard`s. |
| `PricingTierCard` | `src/marketing/PricingTierCard.tsx` | Renders one `PricingTier`; `full` variant adds a "Most popular" badge, CTA button, and all features, `teaser` shows only the first three features. |
| Section components | `src/marketing/sections/*.tsx` | Self-contained presentational sections with no props; all data from `brand`. |

## How it works

`src/marketing/Landing.tsx` is a pure composition root: it renders six sections inside `<main>` followed by `Footer`. None of the sections take props or fetch data.

- `src/marketing/sections/Hero.tsx` renders `brand.hero.title` and `brand.tagline` over a radial gradient, with two buttons: primary to `/signup` (`data-testid="hero-cta"`) and secondary to `/pricing`. It embeds `ProductPreview`.
- `src/marketing/sections/ProductPreview.tsx` is a static mock of the console: a dark sidebar with the light `Logo` and fake nav items, plus a "Research explorer" panel with a fake search box and four result cards. It is markup only, not a screenshot.
- `src/marketing/sections/LogoCloud.tsx` maps `brand.customers` (NORTHSTAR, MERIDIAN, ALTURA, BRIGHTON, QUORUM, FIELDSTONE) as plain styled text under "Trusted by forward-looking teams".
- `src/marketing/sections/FeatureGrid.tsx` carries the `#platform` and `#solutions` anchors targeted by `brand.nav` and renders one hover-lift card per entry in `brand.modules`, each with its Lucide icon.
- `src/marketing/sections/Testimonial.tsx` shows `brand.testimonial` (quote by fictional Elena Park, VP Strategy at Northstar Capital) on the `ink` background with a mint `ShieldCheck` icon.
- `src/marketing/sections/PricingTeaser.tsx` renders all three tiers as `variant="teaser"` cards plus a "Compare all plans" link to `/pricing`.
- `src/marketing/sections/CTA.tsx` is a `bg-brand-600` banner linking to `/signup`.
- `src/marketing/sections/Footer.tsx` shows the `Logo`, the `brand.legal` fictional-company disclaimer, and links to `/pricing` and `/login`.

`src/layouts/PublicLayout.tsx` provides the sticky, blurred header. Desktop nav (from `brand.nav`) and the auth buttons hide below the `md` breakpoint, where a hamburger toggles a stacked menu that includes the nav items plus "Log in". `src/marketing/Pricing.tsx` maps `brand.pricing` to `PricingTierCard` with `variant="full"` in a `md:grid-cols-3` grid; the featured Professional tier gets a brand ring.

Responsive behavior is Tailwind-driven throughout: the hero scales from `text-4xl` to `sm:text-6xl`, the product preview sidebar hides below `sm`, grids collapse from three columns to one on mobile, and the header collapses to the hamburger below `md`.

## Integration points

- All copy and pricing come from the [brand system](brand-system.md); nothing is hard-coded per section.
- CTAs route to the standalone [authentication](authentication.md) pages (`/login`, `/signup`).
- Routing into these pages is defined in `src/App.tsx`; see [System architecture](../overview/architecture.md).

## Entry points for modification

- Reorder or remove landing sections: edit `src/marketing/Landing.tsx`.
- Change copy, customers, testimonial, or tiers: edit `src/config/brand.ts`, not the sections.
- Change tier card layout: edit `src/marketing/PricingTierCard.tsx` (shared by landing teaser and pricing page).
- Change header/nav behavior: edit `src/layouts/PublicLayout.tsx`.

## Key source files

| File | Role |
| --- | --- |
| `src/layouts/PublicLayout.tsx` | Public shell with sticky header and mobile menu. |
| `src/marketing/Landing.tsx` | Landing page composition. |
| `src/marketing/Pricing.tsx` | Full pricing page. |
| `src/marketing/PricingTierCard.tsx` | Shared pricing card with full/teaser variants. |
| `src/marketing/sections/Hero.tsx` | Hero with CTAs and product preview. |
| `src/marketing/sections/FeatureGrid.tsx` | Six-module grid from `brand.modules`. |
| `src/config/brand.ts` | All copy, customers, testimonial, and pricing data. |
