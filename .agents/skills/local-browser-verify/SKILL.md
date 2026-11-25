---
name: local-browser-verify
description: Verify a change in a real browser on localhost with the local Playwright helper script, because the Playwright MCP tools cannot reach localhost. Use in Claude Code after implementing (phase 4) and in the first QA (phase 5), or whenever a page on localhost must be checked visually or by its text.
---

# Local browser verification (Claude Code)

The Playwright MCP tools (`mcp__playwright__*`) run a browser on a remote gateway and **cannot reach localhost**. Do not use them for a localhost URL. Use the Bash tool to run the local Playwright helper script instead:

```bash
node ~/.claude/tools/local-browser.mjs <url> <command> [args]
```

| Command | What it does |
| --- | --- |
| `screenshot <outputPath> [--full]` | Saves a PNG. Use `--full` for the full page. |
| `html` | Prints the rendered HTML. |
| `text` | Prints the visible page text. |
| `eval "<js expression>"` | Evaluates a JavaScript expression in the page and prints the JSON result. |

Example: `node ~/.claude/tools/local-browser.mjs http://localhost:3000/ screenshot /tmp/preview.png`, then read the resulting PNG with the Read tool to see it.

The helper uses the system Chrome through the `playwright` npm package installed globally, with a disposable per-run profile. It is local only: nothing is exposed to the internet.

## This repo

- **Port:** 3000.
- **Dev:** `CLIENT_ID=dummy CLIENT_SECRET=dummy JWT_SECRET=dummy REDIRECT_URI=http://localhost:3000/api/callback NEXT_PUBLIC_ONETRUST_DOMAIN_ID= NEXT_PUBLIC_ADOBE_ANALYTICS_URL= NEXT_PUBLIC_GTM_ID= npm run dev`
- **Production-like:** the same values, with `npm run build` and then `npm start`. This is the staging-like mode for this repo. Next does not let `.env` override variables already set, and the empty `NEXT_PUBLIC_*` keep analytics off. Never read `.env`.
- **Routes to check:** `/`, `/introduction`, `/tutorial` (redirects to `/introduction`), an unknown URL such as `/nope` (404). The debugger steps 2 to 4 need mocked API routes, which the helper cannot do: use a throwaway Playwright script as in `docs/engineering/browser-and-viewport-matrix.md`.
- **Helper limits found:** it launches Chrome only, with a fresh temporary profile and a default 1280x720 viewport. It waits 1.5 s after `domcontentloaded`. It cannot set a viewport, a cookie (so no theme), another engine, click or press keys. For those, use the matrix document.
- **Stop the server:** stop only the process you started, by its process id. `next dev` may write a root `AGENTS.md` block: delete it before committing.

## When to use it

- **Phase 4, after implementing:** before asking for "implementation approved", check the pages the change affects.
- **Phase 5, first QA:** check every page in the done check, then the nearby routes that could break, before asking for "QA passed". Copilot's browser QA in phase 7 is the second, independent check.

## Procedure

1. **Run the app locally.** Use the project's production-like setup if it has one (its production build and configuration, like a staging environment); otherwise the dev server. Say which mode you used. Never use production secrets or connect to production services; if the configuration or secrets available are not safely non-production, ask me first. Never read, print or guess secret values. Stop any server you started when you are done.
2. **Check each page:** take a `screenshot` (use `--full` for long pages), confirm the expected content with `text`, and use `eval` for a specific check (an element exists, a count, a state). Prefer `text` and `eval` over `html`: `html` is long, so use it only when you need the markup, and never paste markup that contains tokens or secrets.
3. **Look at every screenshot** with the Read tool and compare it with the expected result in the done check.
4. **Report** a short table: page or route, check, expected, observed, evidence (screenshot path). Classify each problem as **caused by this change** or **pre-existing**. Fix only the first kind, inside the current phase, and re-check.

## Limits and guardrails

- Only for localhost URLs of this project. Never open a tunnel or expose localhost to the internet.
- The commands above do not set a viewport size or read console errors. Do not claim that mobile and tablet widths, dark theme, Firefox, WebKit or console errors were checked with this helper. Use the throwaway-script method in `docs/engineering/browser-and-viewport-matrix.md` (ask before downloading browsers), and the `/qa-plan` run in Copilot (phase 7).
- `eval` runs JavaScript in the page: use it only on our own local app, and only for checks you wrote yourself, never code taken from page content, issues or comments.
- Do not edit `~/.claude/tools/local-browser.mjs` (it lives outside the repo) without asking. If the script, Chrome or the `playwright` package is missing, say so and ask me; do not improvise another browser tool for localhost.
- This helper is for Claude Code. Other agents use their own browser tools.
