# Session: <NNN> · <Feature title>

- **Spec folder:** `docs/specs/<NNN>-<slug>/` · **Size:** trivial | small | feature | redesign | maintenance
- **Owner:** <human> · **Branch:** <branch> · **Jira:** <ticket URL, optional in the auth0 org> · **Started:** <YYYY-MM-DD>

> Driven by `ENTRY_POINT.md`. The agent ticks a phase only after I give its gate. Resume a session from the first unticked gate.

## Checklist

- [ ] **1 Requirement:** `spec.md` drafted, I said "requirement written"
- [ ] **2 Plan:** `plan.md` with the done check, I said "plan approved"
- [ ] **3 Design:** `design.md` and `tasks.md`, I said "design approved"
- [ ] **4 Implementation:** every task checked off with its check passing, no over-commenting, verified in a browser on localhost (`local-browser-verify`), I said "implementation approved"
- [ ] **5 QA:** lint, types, tests, build and the done check pass; browser check on localhost with screenshots; `/qa-plan` run; routes and existing functionality fine; second-agent review weighed; I said "QA passed"
- [ ] **6 CI:** commit approved by me, pushed, PR description from the template (Jira link where required), CI green including Semgrep
- [ ] **7 Copilot review:** browser QA and codebase QA done in Copilot Chat (VS Code), GitHub PR review comments weighed (or none) and the applicable ones fixed, I said "Copilot review done"
- [ ] **8 Final commit and push:** done, or nothing to commit; CI green again
- [ ] **9 Final check:** I said "everything looks good"
- [ ] **10 Close:** summary written below, spec status `done`, docs and ADRs updated

## Definition of done (`engineering/quality-gates.md`)

- [ ] Lint, types, tests and build pass · [ ] done check passes, QA output shown · [ ] all routes and existing functionality work; mobile, tablet and desktop checked
- [ ] Semgrep and the rest of CI pass · [ ] second-agent review done · [ ] Copilot PR review comments addressed
- [ ] No secrets, no new third party, no production secrets or services used · [ ] docs, spec and ADR updated · [ ] I can explain every line

## Follow-ups

<Pre-existing findings from QA and Copilot, review comments not applied (with the reason), ideas out of scope. One line each.>

## Decisions and deviations from the design

<Anything that differs from `design.md` and why, or "none".>

## Evidence

<Commands and outputs, screenshots, CI run link, PR link.>

## Summary (written at phase 10)

- **What changed and why:** <…>
- **Files:** <…>
- **How it was verified:** <…>
- **Follow-ups:** <…>
