# Documentation index

This folder is the project's **single source of truth** for humans and AI agents. It is layered so that an agent loads the minimum context needed (progressive disclosure).

| Layer | Folder | Answers | Changes |
| --- | --- | --- | --- |
| 0. Entry | `/AGENTS.md`, `/CLAUDE.md` | What is this, how do I run it, what are the golden rules? What working rules and CI security policies apply? | Rarely / when a mistake repeats |
| 0. Session | `/ENTRY_POINT.md` | How does an interactive session run, phase by phase, with which gates? (read only when a session starts) | With the workflow |
| 1. Engineering | `engineering/` | How do we build here, and what is the quality bar? | With an ADR |
| 2. Specs | `specs/` | What exactly are we building now, and how will we know it works? | Every feature |
| 3. Decisions | `decisions/` | Why is it this way? | Append-only |
| 4. Agents | `/.agents/` (`agents/`, `commands/`, `skills/`) | Which role, shared command or procedure should the AI follow? | With the workflow |
## Local setup (Claude Code)

The kit is already in the repo: `AGENTS.md`, `CLAUDE.md`, `ENTRY_POINT.md`, `.agents/` and `docs/`. `.claude/` is git-ignored on purpose (it holds local, untracked files such as MCP config), so only `.agents/` is tracked. To let Claude Code find the commands, skills and roles, link them from `.claude/` once per clone, without touching other files there:

```bash
mkdir -p .claude
ln -s ../.agents/commands .claude/commands
ln -s ../.agents/skills .claude/skills
ln -s ../.agents/agents .claude/agents
```

If `.claude/commands`, `.claude/skills` or `.claude/agents` already exist, copy or merge by hand instead of replacing them. Never overwrite `.claude/.mcp.json`.

1. Check: start a session and run `/qa-plan test`. Open `.agents/skills/` and confirm `new-spec`, `add-adr`, `redesign-microsite`, `maintenance-audit`, `pr-description`, `fix-vercel-npm-e401`, `fix-semgrep-findings`, `address-pr-review` and `local-browser-verify` are present.
2. In Claude Code, check that the personal helper `~/.claude/tools/local-browser.mjs` exists (it is not part of the repo) and that `node ~/.claude/tools/local-browser.mjs http://localhost:3000/ text` works against the running app. Folders that start with a dot are hidden in Finder (Cmd+Shift+. shows them).
3. Try it: start a session with **"Use ENTRY_POINT.md"** and a small requirement, and check that the agent creates the spec folder and stops at the first gate.
4. `docs/specs/`, `docs/decisions/` and `docs/engineering/` are the project's records. The three ADRs in `docs/decisions/` are `proposed` until the owner (Auth0 DevRel team) approves them.
5. `engineering/quality-gates.md` says which gates CI enforces (only unit and E2E tests today) and which are run locally.

## Authority order (when documents disagree)

1. `engineering/constitution.md` (non-negotiable)
2. The active spec in `specs/`
3. Everything else

If the code contradicts a document, one of them is a bug: fix it in the same PR or open an issue. Never leave drift.

## Document hygiene

- One topic per file; link instead of copying.
- Write rules as testable statements ("MUST", "MUST NOT") with a reason. Rules with no check are wishes: name the check (lint rule, CI step, review checklist).
- Every doc has an owner and a "last reviewed" date in its header.
