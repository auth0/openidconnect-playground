# Specs

One folder per feature or change: `docs/specs/<NNN>-<slug>/`, created from `_template/` at the start of an `ENTRY_POINT.md` session. It holds the whole story of the change:

| File | Phase | Holds |
| --- | --- | --- |
| `spec.md` | 1 Requirement | What and why: problem, scope, EARS requirements, scenarios |
| `plan.md` | 2 Plan | Approach, alternatives, risks, **done check** |
| `design.md` | 3 Design | How it is built: components, data, boundaries, UI states, checks per requirement |
| `tasks.md` | 3 Design | Small tasks, each with its check |
| `session.md` | all, 10 Close | Phase checklist, follow-ups, deviations, evidence, final summary |

- `NNN` is a zero-padded sequence. Slugs are lowercase-kebab.
- Status lives in each `spec.md` header: `draft → approved → implementing → done → superseded`.
- Specs stay in the repo after delivery. If behavior changes later, update the spec in the same PR (spec-anchored).
- Use the `new-spec` skill to scaffold one, and `requirements-guide.md` (EARS, Given/When/Then) to write the requirements.
- Trivial changes have no folder; small changes use a mini-spec (see the size ladder in `engineering/ai-workflow.md`).
