Write a QA checklist for the change described below, as steps a browser agent can follow. It will be pasted into Copilot Chat in VS Code, which can run the project locally and drive its integrated browser.
For each step: the page, the action, and the expected result.
Cover the done check from the plan first, then nearby pages that could break.

Also include these parts in the checklist:
1. Setup: how to run the project locally: `npm run build` then `npm start` on http://localhost:3000 with dummy values set inline (`CLIENT_ID=dummy CLIENT_SECRET=dummy JWT_SECRET=dummy REDIRECT_URI=http://localhost:3000/api/callback` and the three `NEXT_PUBLIC_*` analytics variables empty), which is the production-like setup here; use it instead of the dev server, finish that setup before the QA starts, and say which mode was used. Production-like never means production resources: do not use production secrets, and do not connect to production environments (databases, APIs, third-party services, analytics). If the configuration or secrets currently available are not production-like and non-production, stop and ask the user before starting QA. Never read, print or guess secret values.
2. Functionality: click through everything in the app (links, buttons, forms, menus, toggles, copy actions) and confirm each one works as before.
3. Routes: visit every route and confirm it loads without console or network errors and shows the expected content. List the routes visited.
4. Viewports, themes and engines: follow `docs/engineering/browser-and-viewport-matrix.md`. Repeat the done check and a pass over `/`, `/introduction`, an unknown URL (404) and the debugger steps at 320, 375, 767, 768, 1280 and 1536 px, in light and dark, and in every browser available (Chromium, Firefox, WebKit or Safari). Check layout, horizontal overflow, the mobile menu (below 768 px), the configuration modal, the theme switcher, keyboard focus and navigation. List the Safari and iOS Safari manual items that remain.
5. Findings: for each problem found, say whether it is caused by this change or already exists without it. Confirm by checking the unmodified base branch when possible; otherwise write "not verified". Report two lists: "Caused by this change" and "Pre-existing / unrelated (follow up later)". Do not fix anything or edit code during QA.
6. Report: pass or fail per step, a screenshot for every failure, and the console errors seen.

Change: $ARGUMENTS
