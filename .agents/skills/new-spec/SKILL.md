---
name: new-spec
description: Draft the requirement (a user story with an INVEST check) from the template in docs/specs/_template/spec.md, then the plan and the design as text in the chat, one gated phase at a time. Use when starting any feature, redesign or non-trivial change, or when the user says "write a spec" or "plan this". It is phases 1 to 3 of ENTRY_POINT.md. Nothing is committed.
---

# New spec

This skill covers phases 1 to 3 of `ENTRY_POINT.md` (requirement, plan, design). Each phase ends at a gate: stop and wait for the human before the next one. No spec folder is created and no file is committed: the records live in the Jira ticket or a GitHub issue (requirement) and in the chat (plan, design, tasks, session checklist).

1. Read `AGENTS.md`, `docs/engineering/constitution.md`, `docs/engineering/architecture.md`, and check the change against the ask-first zones in `CLAUDE.md`.
2. **Requirement:** ask whether a Jira ticket exists.
   - **Yes:** ask for its link and text, and work from it. Do not draft an issue.
   - **No:** draft a GitHub issue **as text in the chat**, from `docs/specs/_template/spec.md`: a user story ("As a ..., I want ..., so that ..."), the INVEST check, scope, EARS requirements (see `docs/specs/requirements-guide.md`), Given/When/Then criteria and constraints. Mark unknowns `[NEEDS CLARIFICATION]`. It is a draft: the human creates the issue manually and links it. Do not create the issue yourself.
   **Stop.** The human edits it and says "requirement written". Re-read what they changed before continuing.
3. **Plan:** write it in the chat: the simplest approach, at least one alternative (including "do nothing"), risks, rollout and rollback, the constitution check, and the **done check** (what the page shows, which QA checklist items or tests pass, and that CI and Semgrep are green). Add an ADR (`add-adr` skill) if the decision is costly to reverse. **Stop** for "plan approved".
4. **Design:** write it in the chat, then the tasks: small tasks, each covering a requirement and naming its check (task 1 is a failing test for a vulnerability ticket). Suggest running `/qa-plan` once the design is approved. **Stop** for "design approved".

Do not write production code in this skill.
