# Asset quality standards

> "High quality" = sharp, small, accessible, and reproducible.

## Format selection

| Asset | Prefer | Avoid | Notes |
| --- | --- | --- | --- |
| Logos, icons, diagrams | **SVG**, optimized, `viewBox` set, no embedded raster | PNG for vector art | Committed in `public/images/` (19 files) and rendered with `next/image`; UI icons are React components in `src/features/common/icons/`. Auth0, Okta and OpenID artwork is brand material: ask first before changing it |
| Photos, screenshots | Let `next/image` serve optimized formats; commit a compressed PNG, JPEG or WebP source | Large unoptimized PNG | There is one raster banner (`auth0-banner-subtract.png`) and one PNG logo today |
| Animations | CSS / SVG; short video (`muted loop playsinline`) | Animated GIF | Respect `prefers-reduced-motion` |
| Fonts | **woff2**, self-hosted. Today: `next/font/google` (Inter, Roboto Mono; downloaded at build time) and local Aeonik woff2 in `src/libs/theme/fonts/` | Third-party font CDNs at runtime | Aeonik is licensed brand type: ask first before replacing or adding font files. No `LICENSES.md` exists |
| Social/OG images | 1200×630 PNG/JPEG | Hand-exported one-offs | `app/layout.tsx` points to `/images/sm-share.png`, which does not exist in `public/images/` today (404); adding it is a follow-up |

## Rules

1. **Declare dimensions** (`width`/`height` or `fill` with a sized parent) on every `next/image`. Prevents layout shift. Set `sizes` honestly: the footer image uses `sizes="100vh"`, which is a known oddity.
2. **Responsive:** `srcset`/`sizes` for content images; ship 1x and 2x at most.
3. **Loading:** with `next/image`, use `priority` for the above-the-fold hero image; leave the rest lazy (the default).
4. **Alt text:** meaningful images describe purpose, not appearance; decorative images use `alt=""`.
5. **Screenshots are generated, not hand-made.** No screenshot script exists in this repo today; do not commit one-off screenshots as site assets.
6. **Source of truth:** keep source files (Figma link, original SVG) referenced in the PR; commit only optimized outputs.
7. **Budgets:** none defined yet ("baseline to be measured" in `quality-gates.md`). Do not add large images without a reason in the PR.
8. **No hotlinking** third-party images; commit them under `public/images/`.

## Review checklist

- [ ] Right format and size · [ ] dimensions set · [ ] alt text · [ ] lazy/eager correct · [ ] looks sharp at 2x · [ ] light and dark variants where it contains UI · [ ] license recorded
