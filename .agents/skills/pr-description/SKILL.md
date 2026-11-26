---
name: pr-description
description: Draft a pull request description from the real changes and evidence. Use when asked for a PR description or before opening a PR. Always uses the repository's own PR template when one exists; uses the bundled fallback template only when none is found.
---

# PR description

Draft the description as text for the human to review. Do not commit, push or open the PR unless explicitly asked.

## 1. Find the repository's template first

Look for, in this order (case-insensitive): `.github/PULL_REQUEST_TEMPLATE.md`, `.github/pull_request_template.md`, `PULL_REQUEST_TEMPLATE.md`, `pull_request_template.md`, `docs/PULL_REQUEST_TEMPLATE.md`, and a `.github/PULL_REQUEST_TEMPLATE/` folder (several templates: pick the one that fits the change, or ask).

- **Found:** use it. Keep its headings, order and checkboxes, and complete every required section. Do **not** mix in the fallback.
- **Not found:** use `template.md` from this skill folder, and tell the user that no repository template was found.

## 2. Gather the facts (don't invent them)

- The change: the uncommitted diff (`git diff`, `git status`), or the commits on the branch if it is already committed.
- The plan and its **done check** (from the chat), the QA output (checklist results, screenshots, test output), and the second-agent review result, if they exist in the session.
- Links: the Jira ticket, or the GitHub issue the human created from the draft requirement (if there is neither, say so: do not invent one), ADRs, Slack or RFC links the user gave you.

## 3. Fill the template

- Describe **what** changed and **why** it matters: design standpoint, code, and the reason for any dependency update. Keep it short and specific to this diff.
- Map kit evidence into whichever sections exist: done check and QA output into the testing section, spec/ADR/Jira into references, docs updated into documentation, review findings that were not acted on (and why) into the changes or testing notes.
- Tick a checkbox only when you can back it with evidence from this session. Otherwise leave it unticked and write what is missing, for example `[NEEDS INPUT: how this was tested]`.
- Never invent links, screenshots, test results, rollout steps or rollback plans. If unknown, ask.
- **Ticket link:** Jira is required in `atko-*` GitHub organizations (not required in `atko-scratch`). In other organizations, such as `auth0`, it is optional: link the Jira ticket if there is one, otherwise the GitHub issue the human created from your draft. If you have neither, ask; do not create the issue yourself.
- **Diagram:** when the change is architectural or touches deployment or endpoints, include a Mermaid diagram (sequence, flow or component) in the description that shows the change. Skip it for small changes. Keep the whole description technical and concise: what changed and why, with evidence, and no filler.
- **Plan and design:** summarize the agreed plan, the design and the follow-ups in the description. They are not committed to the repo.
- **Type of change** (Standard / Emergency / Significant), **deployment prerequisites** and **rollback**: propose a value from the diff, but mark it for the human to confirm; do not decide it for them.
- For vulnerability fixes, mention the failing test that reproduced the issue and that it now passes.
- If the change adds Artifactory auth to the Vercel deploy workflows, see "If this goes in a PR description" in the `fix-vercel-npm-e401` skill for what to explain (the E401 mechanism, OIDC-minted credentials, the leading `#` detail, `$RUNNER_TEMP`, `id-token: write`) and what to flag as unverified.

## 4. Hand over

Print the finished description in a Markdown block, list every `[NEEDS INPUT: ...]` item, and stop. The author must be able to explain every line before it goes to the dev manager.
