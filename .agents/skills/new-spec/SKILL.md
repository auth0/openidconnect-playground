---
name: new-spec
description: Scaffold and draft a feature spec folder (spec.md, plan.md, design.md, tasks.md, session.md) under docs/specs from the templates, one gated phase at a time. Use when starting any feature, redesign or non-trivial change, or when the user says "write a spec" or "plan this". It is phases 1 to 3 of ENTRY_POINT.md.
---

# New spec

This skill covers phases 1 to 3 of `ENTRY_POINT.md` (requirement, plan, design). Each phase ends at a gate: stop and wait for the human before the next one.

1. Read `AGENTS.md`, `docs/engineering/constitution.md`, `docs/engineering/architecture.md`.
2. Pick the next number: list `docs/specs/`, take max + 1 (zero-padded to 3). Slug in lowercase-kebab.
3. Copy `docs/specs/_template/*` to `docs/specs/<NNN>-<slug>/`. Fill only the header of `session.md`.
4. **Requirement:** fill `spec.md` from the human's message: problem, scope and non-goals, EARS requirements (see `docs/specs/requirements-guide.md`), Given/When/Then scenarios, constraints. Mark unknowns `[NEEDS CLARIFICATION]`. **Stop.** The human edits it and says "requirement written". Re-read `spec.md` as they left it before continuing.
5. **Plan:** fill `plan.md` with the simplest approach, alternatives, risks, the **Done check** (what the page shows, which QA checklist items or tests pass, Semgrep and CI green) and the constitution check. Add an ADR (`add-adr` skill) if the decision is costly to reverse. **Stop** for "plan approved".
6. **Design:** fill `design.md`, then `tasks.md`: small tasks, each covering a requirement and naming its check (T1 is a failing test for a vulnerability ticket). Suggest running `/qa-plan` once the design is approved. **Stop** for "design approved".

Do not write production code in this skill. Update the `Status` in the `spec.md` header at each gate.
