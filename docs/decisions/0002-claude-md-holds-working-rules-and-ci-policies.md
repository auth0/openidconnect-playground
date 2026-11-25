---
status: proposed
date: 2026-11-23
decision-makers: Auth0 DevRel team
---

# CLAUDE.md holds standing working rules and CI security policies

## Context and problem statement
ADR 0001 made `CLAUDE.md` a one-line redirect to `AGENTS.md`. In practice the author retypes the same instructions every session (never commit, PR template, how to verify) and CI fails on organization security policies the agent has never read. `AGENTS.md` is vendor-neutral and must stay short, so these items do not fit there.

## Decision drivers
- Stop retyping standing rules · fewer CI failures from unknown rules · keep `AGENTS.md` small and tool-neutral · one place per kind of rule

## Considered options
1. Keep `CLAUDE.md` as a pure redirect; put everything in `AGENTS.md`.
2. `CLAUDE.md` imports `AGENTS.md` (`@AGENTS.md`) and adds working rules and CI security policies.
3. Keep retyping in prompts.

## Decision outcome
Chosen: **Option 2**. `AGENTS.md` stays the vendor-neutral entrypoint; `CLAUDE.md` carries the personal/team working rules and the CI policies, and still loads `AGENTS.md` first. Agreed contents are reviewed by the dev manager.

### Consequences
- Good: fewer repeated instructions and CI round trips; `AGENTS.md` unchanged in size.
- Bad / trade-offs: two files to keep healthy; agents other than Claude do not read `CLAUDE.md`. Anything every agent must follow stays in `AGENTS.md`.

### Confirmation
Dev manager approves the `CLAUDE.md` contents; quarterly review together with `AGENTS.md`; each repeated agent mistake adds one line.
