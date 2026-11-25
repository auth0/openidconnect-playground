---
name: fix-vercel-npm-e401
description: Diagnose a Vercel deploy of this repo that fails while installing dependencies (VERCEL_OIDC_TOKEN is not set, JFrog OIDC token exchange failed, or npm E401). Use only when one of those exact messages appears in a Vercel build; never pre-emptively. This repo already has a Vercel OIDC to JFrog install, so do not apply the GitHub-Actions-based steps without asking.
---

# Vercel install fails (OIDC to JFrog)

**Trigger:** a Vercel build of this repo (preview, development or production) fails in `Installing dependencies...` with one of the messages below. This is usually not caused by the code change in the PR.

If the error text is different, stop and use `/ci-failure` instead. Do not apply this skill pre-emptively.

## How the install works here (read these first, they are ask-first files)

1. `vercel.json` sets `installCommand` to `node scripts/oidc-install.mjs`.
2. The script runs on Vercel's build machine:
   - If `VERCEL_ENV` is unset (a local run), it just runs `npm ci`.
   - Otherwise it requires `VERCEL_OIDC_TOKEN`, exchanges it at the JFrog Access API (`/access/api/v1/oidc/token`, OIDC provider named `vercel`) for a short-lived Artifactory token, rewrites `https://registry.npmjs.org/` to the Artifactory npm URL in `package-lock.json` (the Vercel checkout is ephemeral and the change is never committed), writes a temporary `.npmrc.oidc` (git-ignored) and runs `npm ci --userconfig .npmrc.oidc`, then deletes the file.
3. The deploy workflows (`preview.yaml`, `development.yaml`, `production.yaml`) only call `vercel deploy`; they do not handle registry credentials.

## The failure messages and what each means

| Message in the Vercel build log | Meaning | What to check (with the human) |
| --- | --- | --- |
| `VERCEL_OIDC_TOKEN is not set in <env>. Enable OIDC Federation in Vercel Project Settings > Security > Secure Backend Access with OIDC Federation.` | Vercel did not provide an OIDC token for that environment. | OIDC Federation is enabled in the Vercel project, and the token is issued for that environment (preview, development, production). |
| `JFrog OIDC token exchange failed: <status> <statusText> - <body>` | JFrog rejected the token exchange. | The JFrog OIDC provider named `vercel` exists and trusts this Vercel project and environment (claims such as issuer, audience and subject). Needs JFrog admin access. |
| `JFrog OIDC token exchange returned no access_token.` | The exchange answered without a token. | Same as above; ask the human to look at the JFrog side. |
| `npm error code E401` / `Incorrect or missing password` after the exchange | The token was not accepted by the registry, or the lockfile and the `.npmrc.oidc` registry do not match. | Whether `package-lock.json` or the script changed in the PR; whether the token expired during a long build. |

## What you may do

- Read `vercel.json` and `scripts/oidc-install.mjs` and report which message appeared and which row above applies.
- Check whether the PR changed `package.json`, `package-lock.json`, `vercel.json` or the script, and say so.
- Tell the human what to check in Vercel (project settings, environments) and in JFrog. You cannot see either.

## What you must not do without asking

- Do **not** apply the GitHub-Actions-based approach from the generic version of this skill (JFrog CLI setup action, an OIDC provider for GitHub Actions, `--build-env NPM_RC`, `id-token: write` in the deploy workflows). It is a different mechanism from the one in this repo and would change `.github/workflows/**`, an ask-first zone. If you think it is needed, explain why and ask.
- Do not edit `scripts/oidc-install.mjs`, `vercel.json` or the lockfile, do not write a project `.npmrc`, and do not print or commit any token.
- For a local `npm ci` auth failure (not a Vercel build), use the "Artifactory (JFrog) auth for npm" section in `CLAUDE.md` instead.
- Do not commit, stash, push or force-push on your own; the commit gate in `ENTRY_POINT.md` handles that.

## Report

State: the exact message, the row that matches, what was verified (files read, diff checked) versus assumed, and what the human must check outside the repo.

## If CI is still failing afterwards

Ask the human for the raw Vercel build log or the GitHub Actions run log, then run `/ci-failure` with it. Do not guess a further fix.
