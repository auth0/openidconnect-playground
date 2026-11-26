---
status: proposed
date: 2026-10-28
decision-makers: Auth0 DevRel team
---

# Adopt lightweight spec-driven development with AGENTS.md

## Context and problem statement
AI coding agents are productive but non-deterministic and context-limited. Without shared written intent, each prompt re-derives requirements, style and constraints, producing drift, over-engineering and inconsistent microsites.

## Decision drivers
- Consistency across microsites · reviewability · low ceremony · tool portability · enforceable quality (KISS, SOLID, performance, assets)

## Considered options
1. Prompt ad hoc, no repo docs.
2. Tool-specific rule files only (one per vendor).
3. Vendor-neutral `AGENTS.md` + layered `docs/` + a requirement template (user story, INVEST) used in a Jira ticket or GitHub issue + ADRs (+ Agent Skills for procedures). No per-feature spec folder is committed.
4. Full spec framework (e.g. Spec Kit) with phase gates for every change.

## Decision outcome
Chosen: **Option 3**. It is vendor-neutral (AGENTS.md is read by most agents), keeps the always-loaded context small via progressive disclosure, and scales ceremony to the size of the change, without adding per-change files to the repository. A full framework can be layered later if needed (Option 4 is compatible).

### Consequences
- Good: shared language, less rework, onboarding for humans and agents.
- Bad: docs need upkeep; mitigated by "docs change in the same PR" and a quarterly review.

### Confirmation
PR description links the ticket or issue, any ADR and the done check; quarterly doc review. Track: rework rate (changes requested per PR), review rounds and review time per PR, CI failures per PR caused by rules already written in `CLAUDE.md`. Record a baseline before the pilot so the comparison is honest.
