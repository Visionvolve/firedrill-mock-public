# firedrill-mock

A standalone Next.js 16 + Tailwind app — the **buggy Dr.MAX e-shop** that workshop
participants will fix during the Phase 20 firedrill exercise (Dr.MAX Agentic
Engineering Module 2 → `fire_drill` phase).

This app is a fixture for an internal training exercise. It uses placeholder
branding inspired by drmax.cz (logo wordmark, brand red, neutrals) but is **not**
the real Dr.MAX trademark. It is never deployed publicly outside the workshop.

## Purpose

For Wave 1, ships a vertical slice with **two pages**:

- `/health-medicine` — catalog with 6 SKUs in a grid, "Přidat do košíku" buttons
- `/cart` — cart UI with subtotal that contains **INC-E (cart total stale on remove)**
  pre-seeded as the v1 firedrill bug

INC-E lives in `components/Cart.tsx`. The bug pattern (regex-anchored signature
`if (items.length >= seen)`) is what downstream incident specs grep for. The
intended fix is to drop the `>=` guard and recompute subtotal on every items
change (or use `useMemo`).

## Run locally

```bash
cd firedrill-mock
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # next build (uses output: 'standalone')
npm run start        # production server
npm test             # playwright tests (requires npx playwright install on first run)
```

## Visual notes

The visual reference is https://www.drmax.cz/zdravi-a-leky (the Health & Medicine
catalog page on the live Dr.MAX Czech online pharmacy). Direct fetching of the
page during scaffolding hit a Cloudflare bot challenge, so the brand tokens were
sourced from prior visual inspection captured in the Phase 20 plan and fixed in
`data/brand-tokens.ts`. Key cues we replicate:

- **Brand red** `#E2001A` for the top utility bar, primary CTAs, and prices
- **Neutral background** `#F7F7F8` with `#E5E5E5` borders for a clean catalog grid
- **Open Sans** as the primary typeface (loaded from Google Fonts)
- **Header layout**: red top bar (tagline left, cart count right) over a white
  nav row with logo + search + category links
- **Product card**: square image area, category caption, bold title, large red
  price, full-width red "Přidat do košíku" button
- **Footer**: dark slab with three columns of customer-service / about / help
  links and a thin red top accent border

## Architecture

```
firedrill-mock/
├── app/
│   ├── layout.tsx          — HTML shell, header + footer
│   ├── page.tsx            — landing
│   ├── health-medicine/    — catalog
│   └── cart/               — cart page
├── components/
│   ├── SiteHeader.tsx      — red top bar + white nav
│   ├── SiteFooter.tsx      — dark footer with link columns
│   ├── ProductCard.tsx     — grid card + "add to cart"
│   ├── CartLineItem.tsx    — qty/remove row
│   └── Cart.tsx            — subtotal block (INC-E lives here)
├── lib/
│   ├── cart-store.ts       — useCart() — localStorage-backed
│   └── pricing.ts          — computeSubtotal() — stable signature
├── data/
│   ├── products.json       — 6 SKUs
│   └── brand-tokens.ts     — DRMAX_BRAND constant
├── public/logo-drmax.svg   — placeholder wordmark
├── tests/                  — playwright incident specs (added in Plan 20-03)
├── Dockerfile              — multi-stage node:22-alpine, Next standalone
├── next.config.mjs         — output: 'standalone'
├── tailwind.config.ts      — drmax color palette
└── playwright.config.ts    — testDir: './tests', BASE_URL configurable
```

## Deployment

See Plan 20-04+ for the staging VPS deploy (per-participant Docker container +
git branch on a shared bare repo at `/srv/firedrill/firedrill-mock.git`).
Container is built from this directory's `Dockerfile`.

## Disclaimer

This is a training fixture. The Dr.MAX wordmark, colors, and product data are
**approximations** used solely for an internal workshop exercise and are not
intended for any external use.
