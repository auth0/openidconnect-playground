# Design: <NNN> · <Feature title>

- **Spec:** ./spec.md · **Plan:** ./plan.md · **Status:** draft | approved

> Written in phase 3, after the plan is approved. Describes *how it is built*. Keep it short: only what an implementer cannot infer from the code and the plan.

## Components and modules
<Single responsibility each. Name the files to create or change. Prefer extending existing patterns.>

## Data and state
<Content or data model, state that is held, where it lives. Pure functions for logic; side effects only at the edges.>

## Boundaries and IO
<Where network, storage, env or the DOM is touched. Routes added or changed.>

## UI
- **States:** empty · loading · error · success
- **Themes:** light and dark, tokens only (`engineering/design-system.md`)
- **Responsive:** behavior at the viewports in `docs/engineering/browser-and-viewport-matrix.md` (at least 320, 768 and 1280 px), light and dark, Chromium, Firefox and WebKit
- **Accessibility:** keyboard, focus, semantic HTML, reduced motion

## Security notes
<Input handling, third parties, secrets, CSP impact. "None" if truly none.>

## Diagram
<Mermaid sequence or flow, only if non-trivial.>

## How each requirement is checked
| Requirement | Check (test, command or QA checklist item) |
| --- | --- |
| R1 | … |

## Decisions and ADRs
<Costly or hard-to-reverse choices, with the ADR link (`add-adr` skill). Dependencies are not added here unless the plan approved them.>
