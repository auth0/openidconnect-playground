Here is the CI failure: $ARGUMENTS
If no error text was given above, ask me for the raw CI log from GitHub (Actions run, failed job, raw logs) and wait; do not guess or describe the failure from memory.
Check it against the CI security policies in CLAUDE.md and tell me which rule it breaks before changing anything.
If a rule names a skill or a fix (for example the Artifactory npm auth, or the `fix-vercel-npm-e401` skill), say which one applies and wait for my go-ahead.
If no rule in CLAUDE.md covers it, say so and propose the one line to add (what the rule requires, and how CI reports it).
If CI is still failing after the fix, ask me for the new raw log from GitHub and run this check again.
