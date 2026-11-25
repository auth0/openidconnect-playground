# AGENTS.md

> Always-loaded project context for AI agents and contributors. Kept under 150 lines: it is loaded every session.
> To run a full interactive session (requirement, plan, design, implementation, QA, CI, Copilot review, commit, close), say **"Use ENTRY_POINT.md"**.
> Anything long lives in `docs/` and is read **on demand** (see "Where to look").

## Project

**OpenID Connect Playground** (openidconnect.net): an interactive debugger that walks developers through the OpenID Connect authorization code flow step by step, with an introduction page.
Stack profile: `nextjs-app` (Next.js 16 App Router, React 19, TypeScript strict, SCSS modules). Deployed to: Vercel, through GitHub Actions. Owner: Auth0 DevRel team.

## Commands

```bash
npm ci                                  # install (Node 24.x per package.json engines)
npm run dev                             # dev server on http://localhost:3000
npm run build && npm start              # production-like run on http://localhost:3000
npm run lint                            # ESLint (eslint.config.mjs)
npx tsc --noEmit                        # types (there is no typecheck script)
npm run test:run                        # Vitest unit tests in tests/ (node environment)
NODE_OPTIONS="--no-experimental-strip-types" npm run test:e2e   # Playwright, Chromium + Firefox, backend mocked
```

Local runs use dummy values set inline, never real secrets (names only, in `.env.sample`):
`CLIENT_ID=dummy CLIENT_SECRET=dummy JWT_SECRET=dummy REDIRECT_URI=http://localhost:3000/api/callback NEXT_PUBLIC_ONETRUST_DOMAIN_ID= NEXT_PUBLIC_ADOBE_ANALYTICS_URL= NEXT_PUBLIC_GTM_ID= npm run dev`
(Next does not let `.env` override variables already set; the empty `NEXT_PUBLIC_*` keep analytics tags off.)

"Done" means: lint, `tsc`, unit tests and build pass locally, **and** the done check from the plan passes with the QA output shown (browser check per `docs/engineering/browser-and-viewport-matrix.md` for UI changes). CI enforces only unit tests and E2E today (`docs/engineering/quality-gates.md`), so the other gates are on you. Never report a task complete without running them.

## Golden rules (summary; full text: docs/engineering/constitution.md)

1. **Spec before code** for anything larger than a small fix. `ENTRY_POINT.md` gates each phase on human approval.
2. **KISS and YAGNI.** No dependency, framework or abstraction without a written reason (ADR).
3. **Tokens, not literals.** New CSS uses the `--color_*` custom properties and the `$breakpoint-dimension-*` variables. Existing hard-coded hex is legacy: do not copy it.
4. **Ask first in sensitive areas.** If a change touches an ask-first zone (`CLAUDE.md`), stop and ask before editing.
5. **Do not break a viewport or a browser.** UI changes are checked in light and dark, at the viewports and engines in the matrix (Chromium, Firefox, WebKit; Safari by hand).
6. **Security by default.** No secrets in the repo or the client bundle, no third-party resource without an ADR, user-supplied URLs and tokens are untrusted.
7. **Small, reviewable changes.** One concern per PR. Generated and legacy files are never hand-edited.
8. **Decisions are written down.** A hard-to-reverse choice gets an ADR in `docs/decisions/`.
9. **Ask when blocked, assume when not.** Resolve ambiguity from the code and docs first; ask only for product decisions.

## Where to look (read only what the task needs)

| Task | Read |
| --- | --- |
| Start a session, run the full flow | `ENTRY_POINT.md` |
| Write requirements for a spec | `docs/specs/requirements-guide.md` |
| Any code change | `docs/engineering/constitution.md`, `docs/engineering/principles.md` |
| Layout, folders, data flow, environments | `docs/engineering/architecture.md` |
| Visual change, new component | `docs/engineering/design-system.md`, `docs/engineering/browser-and-viewport-matrix.md`, `docs/engineering/assets.md` |
| Before a PR, the PR description | `docs/engineering/quality-gates.md`, `.agents/skills/pr-description/` |
| API routes, cookies, analytics, dependencies | `docs/engineering/security.md` |
| How to work with an agent | `docs/engineering/ai-workflow.md` |
| Past decisions, in-flight features | `docs/decisions/`, `docs/specs/` |

## Skills and agent roles

- Skills: `.agents/skills/*/SKILL.md`: `new-spec`, `add-adr`, `redesign-microsite`, `maintenance-audit`, `pr-description`, `fix-vercel-npm-e401`, `fix-semgrep-findings`, `address-pr-review`, `local-browser-verify` (Claude Code).
- Roles: `.agents/agents/*.md`: `architect`, `implementer`, `reviewer`, `quality-auditor`.
- Commands: `.agents/commands/*.md`: `/qa-plan`, `/codebase-qa`, `/review-diff`, `/ci-failure`. `.claude/` is git-ignored here, so link them locally (setup in `docs/README.md`).
- Working rules, ask-first zones and CI policies: `CLAUDE.md`.

## Project-specific facts

- **Branches and deploys:** a push to `master` or `production` deploys to production; `development` deploys development.openidconnect.com; every other branch push deploys a Vercel preview (and comments the URL on the PR). PRs target `master`. Never push to those three branches.
- **Where the code is:** routes and `app/api/*` handlers in `app/`; features in `src/features/<feature>/{components,services,models,actions}`; theme and fonts in `src/libs/theme/`. `tsconfig` maps `*` to `./src/*`, so imports read `features/...` and `libs/...`.
- **Theme:** the `preferred_theme` cookie (`light` default) is read in `app/layout.tsx` and rendered as `data-theme` on `<body>`. Tokens are CSS custom properties in `src/libs/theme/styles/globals.scss`; breakpoints and SCSS variables in `_variables.scss`. This is not an `html[data-theme]` setup.
- **Analytics order:** OneTrust, then Adobe Tags, then Google Tag Manager, in `<head>` of `app/layout.tsx`; each is skipped when its `NEXT_PUBLIC_*` variable is empty. Do not reorder.
- **Env variable names:** `CLIENT_ID`, `CLIENT_SECRET`, `JWT_SECRET`, `REDIRECT_URI`, `NEXT_PUBLIC_ONETRUST_DOMAIN_ID`, `NEXT_PUBLIC_ADOBE_ANALYTICS_URL`, `NEXT_PUBLIC_GTM_ID`. Set per environment in Vercel. Never read `.env*`.
- **Install on Vercel:** `vercel.json` runs `scripts/oidc-install.mjs` (Vercel OIDC to JFrog). Do not change it; see `fix-vercel-npm-e401`.
- **Legacy, not imported by the TypeScript app:** `public/bundle.js`, `src/app.js`, `src/components/*.js`, `src/utils.js`, `src/styles.styl`, and `public/cookie-consent.js`. Do not edit or delete without asking.
- **Next-generated block:** `next dev` may write its own agent-rules block into `AGENTS.md`. Never commit that block.
- **Known gaps** (not enforced today): no lint, type check or build in CI; no CSP or security headers configured; no WebKit in E2E; `public/images/sm-share.png` (referenced by metadata) is missing. See `docs/engineering/quality-gates.md`.
