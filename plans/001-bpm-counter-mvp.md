# BPM Counter MVP Plan

## Goal

Deliver the minimal online tap-rate counter described in `requirements.md`: one large tap button and one rate display, optimized for phones, using React, Vite, and shadcn/ui.

## Background and Current Behavior

- The workspace has requirements and `.ai/` workflow/convention documents, but no application scaffold, dependencies, or tests.
- Vercel sign-in and project setup were completed earlier in this conversation. The local folder and GitHub repository are linked to `coding-challenge/bpm-counter`; the last inspected framework preset was `Other`. Recheck settings during deployment execution.
- `.gitignore` already excludes `.vercel` and `.env*`; preserve these rules and never commit generated credentials.
- Follow `.ai/ai_workflow.md`: planning, task creation, and execution remain separate. This document is the planning deliverable; executable task files are created later when requested or approved.
- Apply the general conventions in `.ai/coding_convention.md`: focused components/hooks, one owner for state, explicit TypeScript types, local state, and clear naming. Its post-feed examples and API requirements do not apply to this app.

## Scope

- Initialize a React + TypeScript + Vite app at the workspace root with npm and a lockfile.
- Add shadcn/ui styling and a native-button-based primary tap control.
- Implement rolling tap timing, accidental-tap filtering, and pause recovery.
- Build a minimal accessible phone layout that keeps the same structure on larger screens.
- Validate behavior, produce a production build, and prepare/configure Vercel for Vite.
- Include a final publishing stage to fulfill the requirement that the page is available online.

## Out of Scope

- Accounts, APIs, backend, database, analytics, saved sessions, or transmitting tap data.
- Automatic heartbeat/step detection, device integration, mode selection, history, charts, reset controls, and visible tap counters.
- A separate desktop layout, offline/PWA support, custom domains, and elaborate animations.
- Source implementation, commits, pushes, or deployments during this planning turn.

## Implementation Decisions

### Calculation and State

- Store at most 5 accepted timestamps and the last calculated rate in one state object owned by `useBpmCounter`.
- Read time with `performance.now()` in the interaction handler. Pass the timestamp to a pure state-transition function so behavior can be tested deterministically.
- Begin with an empty timestamp window and displayed rate `0`.
- First valid tap: store its timestamp; retain the displayed number.
- From the second valid tap onward, calculate `60000 * (n - 1) / (lastTimestamp - firstTimestamp)` using milliseconds and the current window size `n`.
- Once more than 5 taps have been accepted, discard the oldest timestamp before calculating.
- Round the displayed rate to the nearest whole number; calculate from timestamps without rounding intermediate intervals.
- Implementation default: ignore intervals shorter than `100 ms`. Exactly `100 ms` is valid. This filters accidental rapid activations; it is not a physiological validity check.
- Ignored taps do not move the last accepted timestamp, alter the window, or change the displayed rate. Reject non-finite or non-increasing timestamps in the pure function as well.
- When the gap from the last accepted tap is greater than `5000 ms`, replace the window with the current timestamp and retain the prior rate. The second accepted tap in the new window produces the next result.
- A gap of exactly `5000 ms` remains in the existing window.
- No timeout clears or decays the result. Detect a pause on the next interaction, avoiding background timers.
- A page reload starts a new in-memory session at `0`.

### UI and Accessibility

- Use a single-column page with a prominent tabular-number rate display, a large shadcn/ui button, and concise instructions.
- Keep the display labeled BPM as requested. Supporting text explains that tapping heartbeats measures beats/minute and tapping each left/right step measures steps/minute; no mode switch is needed.
- Include the brief manual-estimate text required by `requirements.md`.
- Use a comfortably large tap area, visible keyboard focus, sufficient contrast, and a semantic button with an accessible name.
- Use one activation path (`onClick`) for touch, mouse, and native keyboard activation so a touch is not also counted by a second pointer handler. Suppress repeated keydown activation while a key is held without blocking ordinary Enter/Space use.
- Keep zoom available. Apply `touch-action: manipulation` to the tap button to support repeated tapping.
- Expose the current value and unit accessibly; avoid a live announcement on every tap that would overwhelm screen-reader users.
- Scale typography and spacing with bounded responsive sizing, preserving the same order and layout on desktop. Accommodate phone safe areas and short viewports.

### Architecture and Dependencies

- Keep calculation/window rules in a pure utility and interaction/state ownership in one hook. The page reads the hook and renders the display/button.
- Use React functional state updates to avoid losing closely spaced accepted taps.
- Reuse the shadcn/ui button and utility setup; add only dependencies needed for that component and styling.
- Use Vitest in a Node environment for pure calculation/state-transition unit tests. Do not add React Testing Library, a DOM test environment, component tests, or browser automation.
- At implementation time, confirm compatible current tooling versions using official documentation/package metadata and record exact installed versions in the lockfile.
- Do not introduce routing, a global state library, or a mock API for a single page.

## Target Files and Areas

- `package.json`, `package-lock.json`, `index.html`: scripts, dependencies, entry document, viewport metadata.
- `vite.config.ts`, `tsconfig*.json`, `eslint.config.*`: build, TypeScript, and lint configuration.
- `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`: shadcn/ui setup.
- `src/main.tsx`, `src/App.tsx`, `src/styles.css`: entry point and page styling.
- `src/features/bpm/BpmPage.tsx`: minimal user-facing page.
- `src/features/bpm/hooks/useBpmCounter.ts`: state ownership and tap handling.
- `src/features/bpm/bpm.utils.ts`: constants, explicit state type, pure transition/calculation logic.
- `src/features/bpm/bpm.utils.test.ts`: pure unit coverage of timing and state transitions.
- `.gitignore`: extend existing rules for dependencies and generated build output.
- `vercel.json`: explicit Vite framework, `npm ci` install, `npm run build`, and `dist` output settings.
- `README.md`: local commands, measurement behavior/defaults, deployment instructions, and final live URL when available.

## Dependencies and Sequencing

### 1. Initialize the Frontend

Create the Vite/React/TypeScript scaffold in place while preserving existing files. Add minimal shadcn/ui styling/button dependencies, lint configuration, and scripts for development, build, preview, lint, type checking, and tests. Extend ignore rules. Configure Vercel build settings in the repository.

Expected checks: dependency installation succeeds; `npm run typecheck`, `npm run lint`, and `npm run build` pass with a `dist` directory.

### 2. Implement Tap Calculation

Depends on stage 1. Implement the bounded timestamp window, validation, calculation, and pause transition. Add deterministic unit tests using supplied timestamps. Implement the hook with a single state owner.

Expected checks: the calculation test suite passes, including boundaries and accepted-tap timing after an ignored tap.

### 3. Build and Check the Minimal UI

Depends on stage 2. Wire the page to the hook and apply the phone layout, essential text, focus states, and keyboard behavior. Review the source against the UI requirements, including one activation path, native button semantics, and responsive styling.

Expected checks: pure unit tests, type checking, lint, and production build pass. Record the source review and its limits; UI interaction testing is outside this plan.

### 4. Publish and Confirm Online Availability

Depends on stage 3. Reuse the existing Vercel project and Git connection. Verify the intended team/project, repository-root setting, Vite build settings, and production branch `main` before publishing. Include the application and configuration in the initial Git-connected release when execution of this publishing stage is authorized; a push may trigger deployment automatically.

Watch the resulting deployment to completion, resolve relevant build/configuration failures, and record the final production URL. Check the public HTTP response and that its HTML references accessible built assets. Do not mark this stage complete merely because the build was submitted.

Local implementation completion does not require Git operations. The separate publishing stage does require a release to satisfy online availability; no release action is part of planning.

## Validation Commands and Expected Results

The scaffold must provide these scripts:

- `npm ci`: installs reproducibly from the committed lockfile.
- `npm run typecheck`: TypeScript validation with no errors.
- `npm run lint`: no lint errors.
- `npm run test -- --run`: all pure calculation/state-transition unit tests pass without entering watch mode.
- `npm run build`: produces the deployable static app in `dist`.
- `npm run preview -- --host 127.0.0.1`: optional local preview for the user; not a required testing step.
- `git check-ignore .vercel/project.json .env.local node_modules/ dist/`: generated metadata, credentials, dependencies, and build output are ignored.
- `npx vercel project inspect bpm-counter --scope coding-challenge`: confirms the intended existing project. Also inspect effective deployment settings/logs because repository configuration may override dashboard defaults.
- After publishing, `curl -I <production-url>` should show a successful public response, with no authentication gate. Fetch the HTML and its referenced built assets to confirm the deployed files are accessible; this does not verify browser interaction.

### Calculation Test Cases

- Empty window and first tap keep the initial `0`.
- Two taps `500 ms` apart give `120`; five evenly spaced taps produce the same rate.
- Two taps `1000 ms` apart give `60`.
- Five taps at `0`, `200`, `400`, `600`, and `800 ms` produce `300 BPM`; all are accepted by the `100 ms` minimum-interval rule.
- Varying intervals use total elapsed time across the window, rather than an average of individual BPM values.
- A sixth accepted tap evicts the oldest timestamp and uses only the latest 5 taps.
- Intervals below `100 ms`, non-finite timestamps, and non-increasing timestamps leave state unchanged; exactly `100 ms` is accepted.
- An ignored tap does not shift the reference time for the following accepted tap.
- A `5000 ms` gap stays in the window; a greater gap starts a fresh window and retains the displayed rate.
- After a displayed `120` and a 6-second pause, the first new tap retains `120`; the second new tap 1 second later produces `60`.
- Fractional rates round to the nearest whole number: two taps `490 ms` apart produce approximately `122.449 BPM` and display `122`; two taps `485 ms` apart produce approximately `123.711 BPM` and display `124`.
- The window never grows beyond 5 timestamps.

### Testing Scope and Limits

- Per the user's instruction, test coverage is pure unit tests only. Do not add component tests, UI automation, browser test dependencies, or a mandatory manual UI test stage.
- Use source review for the semantic button, accessible name, visible focus styling, one activation path, held-key handling, responsive layout, and zoom settings.
- Type checking, lint, the production build, and deployment HTTP/asset checks supplement unit tests.
- Unit tests prove the timing rules and pause transitions. Source review and build checks do not prove actual touch/keyboard behavior, visual layout, or screen-reader behavior; record those limits honestly in the final implementation handoff.

## Open Questions and Risks

- No blocking product questions remain. `100 ms` accidental-tap filtering and nearest-integer display are documented implementation defaults.
- Heartbeats and steps share the same calculation but different units; instructions must explain what the user is counting without adding a selector.
- The connected repository can trigger deployment on a release push. Prepare the application and build settings before the first publishing action.
- Remote Vercel settings may change between planning and execution; verify them instead of recreating the project.
- Real-browser layout, touch/keyboard behavior, and screen-reader behavior remain untested under the agreed pure-unit-test scope; browser availability is not a blocker for this plan.

## Planning Validation

- Read `requirements.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.gitignore` completely.
- Inspected the workspace file list and confirmed there is no app scaffold yet.
- Cross-checked the plan against the agreed 2-tap start, latest-5 window, strict greater-than-5-second pause boundary, retained result, no-reset UI, mobile layout, and deployment target.
- No implementation task was executed, no application tests were run, and no remote settings were changed during planning.
- Updated the validation approach to the user's explicit pure-unit-test preference: no component tests or UI automation, with static/build and deployment availability checks retained.
