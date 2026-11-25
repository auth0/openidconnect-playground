---
name: redesign-microsite
description: Plan and execute a visual or structural redesign of a microsite through design tokens, with baseline measurements and before/after evidence. Use when re-theming, rebranding, changing information architecture, or migrating a microsite to the shared design language.
---

# Redesign a microsite

## 1. Baseline (no changes yet)
- Capture screenshots (light and dark, Chromium, Firefox and WebKit, at the viewports in `docs/engineering/browser-and-viewport-matrix.md`) of `/`, `/introduction`, the 404 page and the debugger steps.
- Record Lighthouse (mobile) and bundle/page weight (no baseline exists yet); list all images (format, size, dimensions, alt).
- Inventory the `--color_*` tokens in use and any hard-coded colors/sizes (`grep` for hex in `src/features/**/*.module.scss`).

## 2. Spec
Use `new-spec` with size = redesign. Include: goals and metrics, in/out of scope, pages affected, token changes, assets to replace, rollback plan. Add an ADR if the stack or rendering approach changes.

## 3. Tokens first
- Change primitives and semantic tokens in `src/libs/theme/styles/globals.scss` (`:root` and `body[data-theme="light"]`); both themes; verify contrast. Token values and names are an ask-first zone.
- Remove hard-coded values found in the baseline by mapping them to tokens (separate PR from visual changes when possible).

## 4. Components, then pages
- Update shared components before page-specific CSS. One component family per PR.
- Follow `docs/engineering/design-system.md` and `assets.md`; there is no screenshot script in this repo, so attach screenshots from the matrix run.

## 5. Verify
- Run all gates in `quality-gates.md`; compare against the baseline; budgets must not regress.
- Attach before/after screenshots and metrics to the PR.

## 6. Document
Update `design-system.md`, `AGENTS.md` project facts, and the spec status.
