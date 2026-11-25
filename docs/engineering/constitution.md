# Engineering constitution (golden rules)

> Non-negotiable. Highest authority in `docs/`. Changing a rule requires an ADR. Agents MUST read this before any code change.
> Owner: Auth0 DevRel team · Last reviewed: 2026-11-24 (proposed with the AI engineering docs; not yet approved by the owner)

Each article: **Rule** → **Why** → **Enforced by**.

## I. Simplicity first (KISS, YAGNI)
- **Rule:** Implement the least that satisfies the acceptance criteria. No speculative options, hooks or layers. Prefer platform features (CSS, `fetch`, `node:*`) over libraries; prefer one library over two.
- **Why:** Every line is future maintenance and AI-context cost. Agents over-build by default.
- **Enforced by:** Review checklist item "could this be deleted?"; ADR required for any new dependency or framework.

## II. Spec before code
- **Rule:** Work larger than a small fix starts from a spec (`docs/specs/`). Code that cannot be traced to a requirement or a bug report is out of scope.
- **Why:** Intent written once beats intent re-guessed per prompt. See `ai-workflow.md` for the size ladder.
- **Enforced by:** the PR description (repo template, or the `pr-description` skill) links the spec; reviewer rejects unlinked feature PRs.

## III. Clean code and SOLID
- **Rule:** Follow `principles.md`. Names reveal intent, functions do one thing, modules have one reason to change, depend on abstractions at boundaries.
- **Why:** Readable code is the cheapest form of documentation for humans and agents.
- **Enforced by:** Lint, review checklist, size limits in `principles.md`.

## IV. Tokens, not literals
- **Rule:** In this repo, new CSS takes colors from the `--color_*` custom properties and breakpoints from the `$breakpoint-dimension-*` variables (`docs/engineering/design-system.md`). Existing hard-coded hex and `rem` literals are legacy: do not copy them, and do not rewrite them inside an unrelated change.
- **Why:** Theming (light/dark), brand consistency across microsites, and safe redesigns.
- **Enforced by:** design-system review. Not enforced by tooling: there is no Stylelint or grep check.

## V. Progressive enhancement and accessibility
- **Rule:** Content and primary actions work without JavaScript where feasible (the debugger itself needs JavaScript). WCAG 2.2 AA. Keyboard operable, visible focus, reduced-motion respected. Not met today: the global `outline: none` removes most focus rings, and `prefers-reduced-motion` is not handled.
- **Why:** Resilience, SEO, and users with assistive tech.
- **Enforced by:** manual keyboard pass in review. No automated axe check exists.

## VI. Performance and assets are budgets
- **Rule:** Budgets in `quality-gates.md` become requirements once measured; none are defined today ("baseline to be measured"). Assets follow `assets.md`: right format, right size, declared dimensions, lazy where below the fold, self-hosted fonts.
- **Why:** Speed is a product feature and an SEO input; assets are the usual regression source.
- **Enforced by:** asset review. No CI size or Lighthouse check exists.

## VII. Security by default
- **Rule:** Follow `security.md`: no secrets in repo/bundle, no unvetted third-party resource, validate at trust boundaries, ask first in the zones listed in `CLAUDE.md`, pin and audit dependencies. A CSP and security headers are not configured in this repo; adding them is an ADR-level change.
- **Why:** These sites teach security; they must model it.
- **Enforced by:** the organization SCA scan on `master`, review, ADR for exceptions.

## VIII. Tests prove behavior
- **Rule:** Every acceptance criterion maps to an automated check or an explicit manual step in the spec. Bugs get a failing test first.
- **Why:** Agents are confident and sometimes wrong; tests are the independent judge.
- **Enforced by:** CI runs the unit and E2E tests; lint, types and build are not in CI. Spec `tasks.md` lists the test for each task.

## IX. Small, reversible, reviewable
- **Rule:** One concern per PR; no unrelated refactors; generated output is never hand-edited; destructive or irreversible actions need human confirmation.
- **Why:** Review quality collapses on large diffs; agents drift on long tasks.
- **Enforced by:** PR size guideline (~400 changed lines excluding generated files), review.

## X. Write the decision down
- **Rule:** Irreversible or architecture-shaping choices get an ADR. Docs change in the same PR as the behavior they describe.
- **Why:** Prevents re-litigation and doc rot; gives agents the "why".
- **Enforced by:** Reviewer checks docs/ADR diff.

## XI. Human accountability
- **Rule:** A human owns every merged change. AI output is a draft: the author must be able to explain every line. AI never merges, force-pushes, or changes secrets/infra without explicit instruction.
- **Why:** Accountability does not transfer to a tool.
- **Enforced by:** required human review. Branch protection settings are not recorded in the repo.
