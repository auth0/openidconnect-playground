# Writing requirements (EARS + Given/When/Then)

Requirements are written from the template in `docs/specs/_template/spec.md`, as a user story with an INVEST check. They live in the Jira ticket or in a GitHub issue, not in the repo. Write them so an agent can implement and a test can verify them.

## User story and INVEST

`As a <role>, I want <capability>, so that <benefit>.` Then check it is **I**ndependent, **N**egotiable, **V**aluable, **E**stimable, **S**mall and **T**estable. A story that fails Small or Independent gets split before work starts.

## EARS patterns (Easy Approach to Requirements Syntax)

| Pattern | Template | Example |
| --- | --- | --- |
| Ubiquitous | The `<system>` shall `<response>`. | The debugger shall present the four authorization code flow steps in order. |
| Event-driven | When `<trigger>`, the `<system>` shall `<response>`. | When the user presses "Exchange" in step 2, the debugger shall call `api/code_to_token` and show the response. |
| State-driven | While `<state>`, the `<system>` shall `<response>`. | While the `preferred_theme` cookie is `dark`, the site shall render the dark tokens. |
| Unwanted | If `<condition>`, then the `<system>` shall `<response>`. | If the discovery document is not valid JSON, then the configuration modal shall show an error and keep the previous values. |
| Optional | Where `<feature>`, the `<system>` shall `<response>`. | Where the viewport is narrower than 768 px, the page shall show the mobile header. |

## Acceptance criteria

Each requirement gets at least one scenario:

```
Given <precondition>
When  <action>
Then  <observable outcome>
```

## Rules of thumb

- One requirement, one testable behavior. If you need "and", split it.
- Describe **what and why**, not **how** (the how belongs in the plan and the design, which stay in the chat).
- Mark unknowns `[NEEDS CLARIFICATION: question]`. An agent MUST NOT guess product decisions; it asks.
- Reference the rule a requirement comes from (a constitution article, a section of `security.md`, an ADR).
- The plan's **done check** restates the acceptance scenarios as what the page shows or which QA checklist items pass.
