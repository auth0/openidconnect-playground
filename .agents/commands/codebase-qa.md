Write a codebase QA prompt for the change described below. It will be pasted into Copilot Chat in VS Code, which can read the whole workspace and use the terminal.
The prompt must ask Copilot to:
1. Find everything the change touches or depends on: callers and consumers of the changed code, shared components, routes, types, config and tests.
2. Check that nothing there broke. Run `npm run lint`, `npx tsc --noEmit`, `npm run test:run` and `npm run build` (dummy env values from `AGENTS.md`) if the terminal is available and report the real output. For UI changes, also check the change against `docs/engineering/browser-and-viewport-matrix.md`. Look for places that should have changed but did not (call sites, outdated tests, types, docs).
3. Check the change against the plan and the project rules: every requirement met and nothing extra, SOLID and functional style, KISS, new CSS uses `--color_*` tokens and the breakpoint variables, no ask-first zone from `CLAUDE.md` touched without approval, no over-commenting, no secrets and no new third party, and existing functionality and routes still intact.
4. Classify each finding as "caused by this change" or "pre-existing / unrelated (follow up later)". Confirm by checking the unmodified base branch when possible; otherwise write "not verified".
5. List the findings ranked by severity, each with the file and line. Do not edit any code, and never read or print secret values.

Plan and change: $ARGUMENTS
