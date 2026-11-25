---
name: add-adr
description: Create an Architecture Decision Record in docs/decisions from the template. Use when adding a dependency or framework, allow-listing a third party, changing a budget or rendering strategy, or deviating from the constitution.
---

# Add ADR

1. List `docs/decisions/`; next number = max + 1, four digits.
2. Copy `0000-template.md` to `NNNN-title-with-dashes.md`.
3. Fill context, drivers, at least two real options plus "do nothing", outcome, consequences, and **confirmation** (how we will verify it holds).
4. Set `status: proposed`; a human sets `accepted` on merge.
5. If it replaces an older ADR, set that one to `superseded by [ADR-NNNN]` and link both ways. Never rewrite an accepted decision.
