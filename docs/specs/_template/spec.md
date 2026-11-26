# <Title: the capability, in a few words>

> Requirement template. It is **not** committed per change. In phase 1 of `ENTRY_POINT.md` the agent drafts it as text in the chat, from the requirement. If a Jira ticket already exists, use the ticket and do not draft an issue. If none exists, this text is the draft of a GitHub issue: the human creates the issue manually and links it to the PR. Delete the notes in angle brackets.

## User story
**As a** <role: developer learning OpenID Connect, maintainer, ...>
**I want** <capability>
**so that** <benefit>.

## INVEST check
| Attribute | Check | Result |
| --- | --- | --- |
| Independent | Can it be built and shipped without another story landing first? | <yes / depends on ...> |
| Negotiable | Is it the outcome that is fixed, not the implementation? | <yes / no, why> |
| Valuable | Who benefits, and how would we notice? | <...> |
| Estimable | Is it clear enough to size? Unknowns are listed below. | <yes / blocked by ...> |
| Small | Fits one PR (about 400 changed lines or less)? If not, split it. | <yes / split into ...> |
| Testable | Every scenario below can be checked, by a test or a named manual step. | <yes / no, why> |

## Problem and outcome
<Why now? What changes for the user? Max 5 sentences. No solution language.>

## Scope
**In:** <...>
**Out (non-goals):** <...>

## Requirements (EARS)
| ID | Requirement |
| --- | --- |
| R1 | When <trigger>, the <system> shall <response>. |
| R2 | ... |

## Acceptance criteria
- **R1-a** Given ... When ... Then ...
- **R1-b** ...

## Constraints
State only what differs from the defaults:
- Ask-first zones touched (see `CLAUDE.md`): <none / which>
- Browsers, themes and viewports (`docs/engineering/browser-and-viewport-matrix.md`): <default matrix / differences>
- Accessibility, performance, security, SEO: <...>
- UX notes (Figma, screenshots, states: empty, loading, error, success; light and dark): <...>

## Open questions
- [NEEDS CLARIFICATION: ...]

## Links
<Jira ticket if any, ADRs, related issues or PRs.>
