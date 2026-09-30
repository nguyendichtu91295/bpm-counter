# Task

## Goal

Publish the completed MVP to the existing Vercel project and record a publicly accessible production URL.

## Scope

Source plan: `plans/001-bpm-counter-mvp.md`, stage 4. Read the plan, requirements, and workflow. Depends on `task-003-build-mobile-ui` being DONE with passing local validation.

This is the explicit publishing stage; task creation itself does not authorize executing it. When the user requests execution of this stage or the full queue including publishing, carry out the release without asking again for routine authorized steps.

Existing target: team `coding-challenge`, project `bpm-counter`, GitHub repository `nguyendichtu91295/bpm-counter`, production branch `main`, repository root `.`. Project setup and Git connection were completed earlier; verify current state and reuse them. Do not create a duplicate project or modify the team's other projects.

## Target Files and Areas

- `vercel.json`, `package.json`, `package-lock.json`, `.gitignore` if release configuration needs correction.
- Existing Vercel project and its Git-connected deployment settings.
- Application files from tasks 001–003 for the initial release.
- `README.md`: final URL and release instructions.
- This task's `basic_info.md` and `execution.md`.

## Steps

1. Follow dependency checks and task status transitions. Inspect prior validation records and current workspace changes; preserve user work.
2. Inspect the authenticated account and intended existing project. Use CLI help/official documentation for current syntax. If the CLI is not global, use `npm exec --yes --package=vercel -- vercel ...`.
3. Confirm the local link and Git integration target the stated project/repository, with root `.` and production branch `main`. Reuse the link; restore authentication only if needed. Never print credential contents.
4. Ensure effective settings use framework Vite, install `npm ci`, build `npm run build`, and output `dist`. Repository configuration may override dashboard defaults. Resolve relevant mismatches before release.
5. Ensure generated credentials, local Vercel metadata, dependencies, and build output are ignored. Review the exact release file set; never stage unrelated files blindly.
6. Reuse task 003's passing checks if the release inputs are unchanged. If application or build configuration changes, rerun relevant checks before publishing.
7. Prepare and push the intended initial application release to the connected repository's production branch. Inspect remote state first; do not force-push or overwrite existing remote work. A Git push can trigger deployment automatically; do not submit duplicate releases unnecessarily.
8. Monitor the resulting deployment until ready, inspect its logs/effective configuration, and resolve in-scope build or configuration failures. Verify it corresponds to the intended release.
9. Check public HTTP access and built assets as specified below. Automated test coverage remains pure unit tests only. No browser automation, component testing, or mandatory manual UI testing.
10. Record the actual production URL and deployment details in README/execution.md. Mark DONE only when production availability is confirmed. If a real access or external service blocker prevents completion, record the exact failure and follow the workflow's FAILED/stop rules.

## Validation

- `npx vercel whoami`: expected authorized account.
- `npx vercel project inspect bpm-counter --scope coding-challenge`: intended existing team/project/root; supplement with current CLI/API configuration and deployment-log inspection to verify Git integration, main production branch, and effective Vite build/output settings.
- `git check-ignore .vercel/project.json .env.local node_modules/ dist/`: generated and sensitive files remain ignored.
- Review the staged/release diff and remote identity before pushing; exclude credentials and unrelated changes.
- Reuse recorded passing local checks when unchanged. If relevant inputs changed, run `npm ci` as needed, `npm run test -- --run`, `npm run typecheck`, `npm run lint`, and `npm run build`; all must pass.
- Use `npx vercel inspect <deployment-url> --scope coding-challenge` and supported log commands to confirm a ready production deployment for this release.
- `curl -I <production-url>`: public successful response, without a login/protection gate. Follow expected redirects when checking the final URL.
- `curl -fsSL <production-url>`: inspect the actual app HTML, not an error or authentication page. Resolve its referenced script/style URLs against the production URL and fetch them; confirm successful status and appropriate asset content types.
- Record that HTTP/build checks confirm availability and delivered assets, not real-browser interaction or visual correctness.
