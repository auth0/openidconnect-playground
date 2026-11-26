# Design system and tokens

> How styling works in this repo today, verified by running the app in Chromium, Firefox and WebKit (study date 2026-11-24). Goal: change UI without breaking a viewport or a browser. Where the repo does not meet a rule, this file says so.

## Where styling lives

- Component styles: a `*.module.scss` next to each component in `src/features/**` (and `app/layout.module.scss`). Global styles: `src/libs/theme/styles/globals.scss`. SCSS variables, mixins and breakpoints: `_variables.scss` and `_mixins.scss` in the same folder. Modules start with `@use "libs/theme/styles/variables" as *;`.
- Fonts are in `src/libs/theme/fonts.tsx`: Inter and Roboto Mono through `next/font/google` (self-hosted at build time, with a size-adjusted fallback face), and Aeonik from local woff2 files (the `.otf` copies in the same folder are not loaded). Do not replace or rename the Aeonik files (ask first).

## Token layers (three exist; use the middle one)

1. **Primitives, CSS custom properties** in `:root`: `--functional-gray-0` to `--functional-gray-1000` and the brand palette (`--sky`, `--eggplant`, `--violet`, `--lilac`, `--cobalt`, `--cloud`, `--ocean`, `--seafoam`, `--turquoise`, `--clay`, `--tangerine`, `--melon`, `--charcoal2`). Referenced by the semantic tokens, not by components.
2. **Semantic tokens, `--color_*`** (about 75): purpose-named, for example `--color_bg_page`, `--color_fg_bold`, `--color_fg_default`, `--color_border_default`, `--color_bg_button_primary`, `--color_bg_layer`. **New code uses only these.**
3. **SCSS variables** in `_variables.scss`: a second copy of the palette, a second gray scale, gradients, layout sizes (`$navbar-height`, `$ribbon-height`, `$page-min-width`, `$inner-content-grid-max-width: 1312px`, `$extended-grid-max-width: 1536px`) and the media-query strings. Use these only for breakpoints, layout sizes and gradients.

Known problems in the layers (do not copy them, and do not fix them inside an unrelated change):

- About 22 distinct hard-coded hex values (29 uses) in `src/features/**/*.module.scss`; several duplicate a token (`#3f59e4` is `--sky`, `#4016a0` is `--eggplant`, `#191919` is `--charcoal2`). Existing hex is legacy.
- `.ace_*` colors in `globals.scss` are hard-coded hex.
- `--color_bg_scrollbar` is used for the react-select scrollbar thumb but is never defined.
- The `$color_*` SCSS variables inside `body[data-theme="light"] { }` in `_variables.scss` have no effect.
- `globals.scss` has `collapse: var(--color_fg_default)` on `body`; the property is invalid and ignored, so `body` has no `color` of its own.

## Themes

- The server reads the `preferred_theme` cookie in `app/layout.tsx` (default `light`; values `light` and `dark`, from `src/features/theme/theme.config.ts`) and renders `<body data-theme="...">`. The `html` element has no theme attribute.
- Dark values are the `:root` defaults. Light overrides sit under `body[data-theme="light"]`. A new `--color_*` token must be defined in **both** blocks.
- The switcher (`theme-switcher.component.tsx`, a checkbox labelled "Toggle Theme") calls the `setTheme` server action, which sets the cookie with `secure: true`. The theme is applied on the server, so there is no flash for returning users, and the cookie is never read on the client.
- Not handled: `prefers-color-scheme` (no "system" option) and `prefers-reduced-motion`.
- Verified on `http://localhost` in Chromium, Firefox and Playwright's WebKit: the theme cookie persists across reload. Real Safari is not verified; it is on the manual list in the matrix.
- Computed examples: dark `--color_bg_page` is `#111111`, light is `#ffffff`; `--color_bg_button_primary` is `#3f59e4` in both.

## Breakpoints and grid

`_variables.scss` declares about 20 query strings, but only these are used. Use the variable, never a raw number:

| Variable | Query | Used |
| --- | --- | --- |
| `$breakpoint-dimension-xs` | `min-width: 576px` | 3 times |
| `$breakpoint-dimension-sm` | `min-width: 768px` | 62 times; the header switches here |
| `$breakpoint-dimension-md` | `min-width: 992px` | 43 times |
| `$desktop` | `min-width: 1090px` | 3 times |
| `$breakpoint-dimension-lg` | `min-width: 1200px` | 21 times |
| `$breakpoint-dimension-xl` | `min-width: 1400px` | 3 times |

- All are `only screen and (min-width: ...)`, so styles are mobile-first. There is one raw `@media (max-width: 420px)` in `site-brand.module.scss`.
- The other declared values (360, 376, 380, 400, 430, 478, 540, 640, 720, 740, 760, 820) are unused. Do not use them without asking.
- `$page-min-width` is `360px` but the layout has no horizontal overflow at 320 px on any route in any engine today.
- Header: the desktop header shows from 768 px and the mobile header (burger menu) below it.
- Grid (`@mixin InnerContentGrid` in `_mixins.scss`): 6 columns below 768 px, 12 from 768 px; outer margin 16 px below 768, 32 px from 768, 64 px from 1200; gutter 16 px, 32 px from 1400; content max width 1312 px (extended grid 1536 px). Prefer the mixins `InnerContentGrid`, `InnerContentFlex` and `ExtendedGrid` over new width logic.

## Component inventory

Each lives in `src/features/<feature>/components/<name>/` with its own SCSS module.

- Page chrome: `header`, `mobile-header` (fixed, burger menu, locks body scroll), `footer`, `site-brand`, `theme-switcher`, `shell` (the `<body>`).
- Content: `hero-jumbotron`, `introduction-content`, `auth0-banner`, `handbook-banner`, `not-found`, `button` (variants, including a gradient one), `debugger-picker` (react-select).
- Debugger: `debugger-steps` with `step-one` to `step-four`, `debugger-toolbar`, `configuration-modal`, `codeblock`.
- Privacy: `cookie-consent-modal` (only renders when OneTrust is configured; not testable without it).

## Global overrides and their cost

- `globals.scss` styles react-select by class (`.react-select-*`, `.react-select__*`) with about 45 `!important`; `debugger-toolbar.module.scss` has 6 more. A change to a token, a class or the react-select version can break the picker silently. Check the debugger picker and the configuration modal in both themes after touching them.
- `:focus-visible { outline: none }` and `* { outline: none }` remove the default focus ring. Today only the footer links and the "Your Privacy Choices" button show a visible focus style; header links, the theme toggle and the main buttons do not.
- `body` sets `overflow-y: scroll`, `-webkit-overflow-scrolling: touch`, and `html` sets `scrollbar-gutter: stable`. `.mobile-scroll-lock` (added to `<body>` when the mobile menu opens) sets `overflow: hidden; margin-right: 20rem`; do not copy that pattern.

## Typography

- `fonts.tsx` defines `PrimaryFont` (Inter, applied to `<body>`), `MonoFont` (Roboto Mono, `var(--font-mono)`) and `SecondaryFont` (Aeonik Regular, Medium and Bold, `var(--font-secondary)`). All were verified loading in Chromium, Firefox and WebKit. Layout shift on first load was not measured.
- Type and spacing sizes are in `rem` literals inside the modules (no spacing token scale exists). Match neighbouring components; do not invent a new scale.

## Rules for changing UI safely

Each rule is backed by what was observed, or marked **proposed** (standard compatibility practice, not yet observed here).

1. Use `--color_*` for color. Define a new token in both theme blocks. Never reference a custom property that is not defined.
2. Use the six breakpoint variables above. Check each change at the width just below and at the boundary (767 and 768 at minimum).
3. Keep 320 px free of horizontal overflow on `/`, `/introduction`, the 404 page and the debugger steps.
4. Do not rely on `backdrop-filter` for readability. The mobile menu container has no background of its own, so in Playwright's WebKit its text overlaps the page behind it. Give overlays a background that is readable without the blur. Keep the unprefixed property in source; the production build adds `-webkit-backdrop-filter` (10 of each in the built CSS).
5. **Proposed:** use `100dvh` with a `100vh` fallback for full-height layouts. The 404 page uses `calc(100vh - ...)`, and the footer image has `sizes="100vh"`. The iOS dynamic toolbar behavior was not tested.
6. **Proposed:** every interactive element gets an explicit `:focus-visible` style with visible contrast; do not remove outlines.
7. **Proposed:** wrap new animations and transitions in `prefers-reduced-motion`.
8. Next's default browser targets are Chrome, Edge and Firefox 111 and Safari 16.4 (no `browserslist` is set). `scrollbar-gutter` and `scrollbar-width` are ignored by Safari before 18.2, so nothing may depend on them for layout.
9. Do not add `!important` or new global selectors near react-select. Do not add global `outline` removal.
10. Do not hard-code hex or font families in new SCSS.
11. Interactive controls: at least 24x24 CSS px target (WCAG 2.2 AA), 44x44 recommended on touch.
12. Check the result with `docs/engineering/browser-and-viewport-matrix.md` and show before/after screenshots in both themes.

## Redesign checklist

- [ ] Changes live in the token blocks of `globals.scss` or a single scoped module, not scattered overrides.
- [ ] Both themes defined; contrast 4.5:1 for body text, 3:1 for large text and UI boundaries.
- [ ] Screenshots before and after, light and dark, at the viewports in the matrix, in Chromium, Firefox and WebKit.
- [ ] Focus visible on every interactive element touched.
- [ ] No new hex outside the token blocks; no new breakpoint value.
- [ ] Safari and iOS Safari manual items listed in the PR.
