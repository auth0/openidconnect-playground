# Browser and viewport matrix

> What to check for any UI change, and how. Measured on 2026-11-24 with Playwright 1.63 (Chromium, Firefox, WebKit 26.6) against `npm run dev` and a production build, Node 22 locally. `/qa-plan`, `/codebase-qa` and `ENTRY_POINT.md` phases 4, 5 and 7 use this file.

## Routes

| Route | Notes |
| --- | --- |
| `/` | Hero, debugger toolbar, debugger steps 1 to 4, banners, footer |
| `/introduction` | `/tutorial` redirects here (307) |
| any unknown URL, for example `/nope` | 404 page (`not-found`) |
| Debugger step 2, 3, 4 | Needs mocks: route `api/auth_data` (with a `code`), `api/code_to_token` and `api/validate`, as `e2e/debugger.spec.ts` does |
| Configuration modal | Open "Configuration" on `/` |
| Mobile menu | Below 768 px, the burger button ("Open menu") |
| Theme switcher | The "Toggle Theme" checkbox (desktop header, or inside the mobile menu) |
| Cookie-consent modal | Only renders when `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` is set and OneTrust loads, so it is not testable with dummy values. Check it by hand on a preview deploy |

## Themes

Light and dark. Set the cookie before loading: `preferred_theme=light|dark` (name and values from `src/features/theme/theme.config.ts`). Both themes for every check.

## Viewports

The real breakpoints are 576, 768, 992, 1090, 1200 and 1400 (`min-width`) plus one `max-width: 420px`. The header changes at 768 px. Check each boundary at -1 px and at the value.

| Group | Widths (px) |
| --- | --- |
| Phones | 320, 360, 375, 390, 420 (and 419), 430 |
| Boundaries | 575 / 576, 767 / 768, 991 / 992, 1089 / 1090, 1199 / 1200, 1399 / 1400 |
| Tablets | 768x1024 portrait, 1024x768 landscape, 820 |
| Desktop | 1280, 1536 |
| Landscape phone | 844x390 |
| Zoom | 200%: a 1280 px window at 200% behaves like 640x360 CSS px |

Minimum set for a small UI change: 320, 375, 767, 768, 1280 and 1536, in both themes, on `/`, `/introduction` and the 404 page.

## Engines

| Engine | How | Proves | Does not prove |
| --- | --- | --- | --- |
| Chromium | Playwright (and `local-browser-verify`, which uses Chrome) | Blink layout and CSS | Safari, Firefox |
| Firefox | Playwright | Gecko layout, scrollbar styling, `backdrop-filter` | Safari |
| WebKit | Playwright (`npx playwright install webkit`, downloaded outside the repo) | WebKit layout and CSS | Real Safari: no iOS toolbar, a different cookie policy on `http://localhost`, no Safari UI, no device scrollbars |

`playwright.config.ts` runs only Chromium and Firefox. Adding WebKit is a follow-up and an ask-first change.

## Results on 2026-11-24 (all pre-existing)

- No horizontal overflow at any listed width, any route, either theme, in all three engines. Header switch: mobile header at 767 px and below, desktop header from 768 px.
- Debugger steps 2 to 4 render without overflow at 320, 375 and 1280 in all three engines.
- Theme cookie persists across reload on `http://localhost` in all three engines (Playwright WebKit treats localhost as secure).
- Failures and risks:
  - Mobile menu: its container has no background and relies on `backdrop-filter`; in Playwright's WebKit the page text shows through the menu items.
  - Configuration modal at 375 px: page text is visible behind the translucent form.
  - Step 1 code block text is cut off at 320 px.
  - Keyboard focus: only footer links and "Your Privacy Choices" show a focus style; header links, the theme toggle and the main buttons show none. Playwright's WebKit showed none at all.
  - react-select scrollbar: uses an undefined token and only `::-webkit-scrollbar`, so Firefox ignores it.
  - `/images/sm-share.png` returns 404.
  - No `prefers-reduced-motion` or `prefers-color-scheme` handling.

## Manual checklist for real Safari and iOS Safari

Playwright cannot prove these. List the ones a change could affect in the PR and ask the human to run them (Safari desktop, and an iPhone with the dynamic toolbar):

1. Mobile menu is readable over the page (backdrop blur).
2. Theme switch persists, over `http://localhost` and over an HTTPS preview URL (all app cookies use `secure: true`).
3. The authorization redirect flow returns to the app and step 2 opens (`authCode` and `refresh` cookies, `sameSite: lax`).
4. The 404 page height and the footer with the dynamic toolbar showing and hidden (`100vh` is used).
5. Scroll lock while the mobile menu or the configuration modal is open, and rubber-band scrolling.
6. Keyboard focus rings (Tab with Option enabled for links).
7. react-select menu scrollbar and the page scrollbar gutter (ignored before Safari 18.2).
8. The OneTrust consent modal on a preview deploy.
9. Fonts and layout shift on first load.

## How to run each check

Set dummy values inline. Never read `.env`.

```bash
# dev, or production-like (npm run build, then npm start)
CLIENT_ID=dummy CLIENT_SECRET=dummy JWT_SECRET=dummy REDIRECT_URI=http://localhost:3000/api/callback \
NEXT_PUBLIC_ONETRUST_DOMAIN_ID= NEXT_PUBLIC_ADOBE_ANALYTICS_URL= NEXT_PUBLIC_GTM_ID= npm run dev
```

1. **Quick look (Claude Code):** `node ~/.claude/tools/local-browser.mjs http://localhost:3000/ screenshot /tmp/home.png --full`, then read the PNG. It uses Chrome with a fixed default viewport and cannot set a theme, a viewport, another engine or press keys.
2. **Viewport, theme and engine sweeps:** write a throwaway script under `/tmp` (never in the repo) that imports Playwright from this repo's `node_modules`, launches `chromium`, `firefox` and `webkit`, sets the viewport and the `preferred_theme` cookie, aborts non-localhost requests, and reads `document.documentElement.scrollWidth` against `clientWidth`. Ask the human before downloading a browser.
3. **Debugger steps:** mock the three API routes with `page.route`, as `e2e/debugger.spec.ts` does.
4. **Existing E2E:** `NODE_OPTIONS="--no-experimental-strip-types" npm run test:e2e` (Chromium and Firefox only).
5. Stop every server you started, by its process id.

## Limits

- `next dev` writes its own agent-rules block into a root `AGENTS.md`. Delete it before committing; never commit it.
- Aborting external requests means analytics, consent and the provider's real endpoints are not exercised.
- Headless runs do not show classic scrollbars, so scrollbar-gutter and `margin-right` effects on desktop browsers are unverified.
- The helper's Chrome and Playwright's Chromium are not the same build. Say which one you used.
