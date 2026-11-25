---
name: maintenance-audit
description: Run a periodic health audit of a microsite (dependencies, security, accessibility, performance, assets, SEO, docs drift) and turn findings into small tracked tasks. Use for scheduled maintenance, before a release, or when onboarding a repo to this kit.
---

# Maintenance audit

Delegate to the `quality-auditor` role. Measure; do not fix inside the audit.

| Area | Do |
| --- | --- |
| Dependencies | `npm outdated`, `npm audit`; note majors, EOL runtimes (Node, Next), unused packages (several legacy dependencies are not imported) |
| Security | CSP and header status (not configured today), third-party host scan, secret scan, GitHub Actions pinned by SHA (`tests.yaml` is not). Report security findings to the human in the chat only, not in the audit file (the repo is public) |
| Accessibility | keyboard walk-through (focus rings are mostly removed today), contrast of tokens in both themes |
| Performance | Lighthouse mobile, Web Vitals (field data if available), bundle report |
| Assets | list images/fonts: format, bytes, dimensions, alt, lazy/eager, licenses |
| SEO | titles, descriptions, canonicals, sitemap and robots coverage, broken links |
| Docs drift | compare `AGENTS.md`/`docs/` claims with the code; list contradictions |
| Complexity | duplicated code, files > 300 lines, unused exports, speculative abstractions |

**Output:** table `Area | Finding | Evidence | Severity | Fix | Effort`, saved as `docs/specs/<NNN>-maintenance-<yyyy-mm>/audit.md`. The human picks what to do; each accepted item becomes a small spec or issue.
