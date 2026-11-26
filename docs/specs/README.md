# Requirements template

`_template/spec.md` is the only file here. It is a template for the requirement of a change, written as a user story with an INVEST check. No per-change spec folder is committed: that would add many files to the repository.

- **Where a requirement lives:**
  - If a Jira ticket exists, the ticket is the requirement.
  - If none exists, the agent drafts a GitHub issue as text in the chat from the template. The human creates the issue manually and links it from the PR.
- **Where the plan, the design, the tasks and the session checklist live:** in the chat during the session, and summarized in the PR description. They are not committed.
- **Decisions** that are hard to reverse go in `docs/decisions/` (ADRs), which are committed.
- Use the `new-spec` skill to draft the requirement, and `requirements-guide.md` (user story, INVEST, EARS, Given/When/Then) to write it.
- Trivial changes need no issue. Small changes use a short story (see the size ladder in `docs/engineering/ai-workflow.md`).
