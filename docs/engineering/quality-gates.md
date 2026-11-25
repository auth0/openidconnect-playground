# Quality gates

> The Definition of Done. A change is not done until every applicable gate passes. Numbers are **proposed defaults**; tune per microsite with an ADR.

## Gate list

> Honest status: CI runs only the unit tests and the E2E suite (`tests.yaml`, on pull requests to `master` and `ui-redesign`). Every other gate is run locally by the author or agent and is **not enforced in CI**. No budgets or baselines exist yet: where a number is missing, it says "baseline to be measured". Node 24 is used in CI; check what your local Node is.

| Gate | Command | Threshold | Enforced in CI? |
| --- | --- | --- | --- |
| Lint | `npm run lint` | 0 errors | No |
| Types | `npx tsc --noEmit` (no script exists) | 0 errors, `strict` | No |
| Unit tests | `npm run test:run` (Vitest, `tests/`) | pass; new logic covered; bug fixes include a regression test | Yes (`npx vitest run`) |
| E2E | `NODE_OPTIONS="--no-experimental-strip-types" npm run test:e2e` | pass on Chromium and Firefox | Yes (`npx playwright test`) |
| Build | `npm run build` with dummy env values (`AGENTS.md`) | success, no new warnings | Only indirectly, by the Vercel deploy |
| Regression | `/qa-plan` in a production-like local run (`npm run build`, `npm start`, dummy values, no production services) | no new failures; each finding classified as caused by this change or pre-existing | No |
| Responsive and browsers | `docs/engineering/browser-and-viewport-matrix.md` | no overflow or broken navigation in the matrix; Safari items listed | No (WebKit is not in the Playwright config) |
| Accessibility | manual keyboard pass | visible focus on every control you touch; no automated axe check exists | No |
| Performance | none configured | baseline to be measured | No |
| Weight | none configured | baseline to be measured | No |
| Security | org SCA scan on pushes to `master`; Semgrep report (runs in GitHub CI, report shared as screenshots); no `npm audit` in CI | 0 high or critical findings; 0 secrets; no new third-party host | Partly (SCA on `master`; Semgrep to confirm) |
| SEO | metadata in `app/layout.tsx` | present; the og image `public/images/sm-share.png` is missing today | No |
| Docs | spec, ADR and docs updated in the same PR | yes | No |

## Testing guidance

- **Pyramid:** many unit tests on pure functions, fewer integration (route handlers), few E2E on key journeys.
- **Test names** state behavior: `rejects an expired token`, not `test1`.
- **Determinism:** no real network or clocks; fake time, mock fetch at the boundary.
- **Specs:** every acceptance scenario in `spec.md` is traceable to a test or a listed manual step.

## Who runs what

- **Author/agent, locally:** `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run build` before opening the PR; the done check from the plan; the QA checklist (`/qa-plan`), with output shown before "done"; in Claude Code, a browser check on localhost with screenshots (`local-browser-verify`).
- **Second agent:** reviews the uncommitted diff in a fresh session or the second tool before the dev manager sees it (see `.agents/agents/reviewer.md`).
- **CI:** the unit tests and the E2E suite on every PR to `master`, plus the Semgrep report (to confirm where it runs). Which checks are required on `master` is not recorded in the repo. A failing Semgrep report is fixed with the `fix-semgrep-findings` skill before the done check counts as complete.
- **Copilot (second tool):** browser QA (`/qa-plan`) and codebase QA (`/codebase-qa`) in Copilot Chat in VS Code, and Copilot's code review on the GitHub PR. The human pastes the findings and comments to the agent (`address-pr-review` skill for the PR comments): fix the ones that apply, reply to or park the rest.
- **Reviewer (dev manager):** the checklist below. Still approves every change.

## PR review checklist

- [ ] Done check from the plan passes, with QA output shown · [ ] all routes and existing functionality still work; mobile, tablet and desktop checked · [ ] Semgrep and the rest of CI passing · [ ] second-agent review done and findings weighed · [ ] Copilot PR review comments weighed and the applicable ones fixed · [ ] Jira link if a ticket exists (optional in the `auth0` org) · [ ] Linked spec/issue; scope matches · [ ] smallest viable change (KISS) · [ ] no new hard-coded colors or breakpoints · [ ] browser and viewport matrix done, Safari items listed · [ ] a11y verified · [ ] assets per `assets.md` · [ ] no ask-first zone touched without approval · [ ] budgets unchanged or justified (none defined yet) · [ ] tests prove the behavior · [ ] docs/ADR updated · [ ] no secrets, no new third party · [ ] I can explain every line
