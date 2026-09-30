# Task

## Goal

Deliver the minimal accessible mobile page wired to the tested tap calculation.

## Scope

Source plan: `plans/001-bpm-counter-mvp.md`, stage 3. Read the plan, requirements, workflow, and general coding conventions. Depends on `task-002-implement-tap-calculation` being DONE so the UI can consume the established hook and rules.

One large button and one rate display, with essential text only. No reset button, visible tap counter, mode selector, charts, accounts, backend, persistence, or analytics. No component tests, UI automation, or mandatory manual UI test stage.

## Target Files

- `src/features/bpm/BpmPage.tsx`.
- `src/features/bpm/hooks/useBpmCounter.ts` only if needed for integration.
- `src/App.tsx`, `src/styles.css`, `index.html`.
- `src/components/ui/button.tsx` only where needed for styling.
- `README.md`.

## Steps

1. Follow the workflow's dependency checks and status transitions.
2. Render the hook's rate, initially zero, with a prominent tabular-number display and BPM unit. Render one large shadcn/ui tap button.
3. Preserve the agreed behavior: calculate from 2 taps using up to the latest 5, reject intervals below 100 ms, and retain the number when idle. Gaps greater than 5 seconds start a new window; keep the old number until its second accepted tap.
4. Use concise instructions explaining tapping once per heartbeat or every left/right step. Heartbeats measure beats/minute; cadence measures steps/minute. Include the required brief manual-estimate text.
5. Use a semantic native button with an accessible name, visible focus, and adequate contrast. Expose the number/unit accessibly without announcing every tap through a live region.
6. Use one `onClick` counting path for touch, mouse, and native Enter/Space activation. Suppress held-key repeated keydown activation without blocking ordinary keyboard use or introducing duplicate pointer/click counting.
7. Implement a single-column mobile layout with a comfortably large tap target, bounded typography/spacing scaling, safe-area support, and short-screen accommodation. Desktop retains the same layout/order. Apply `touch-action: manipulation` to the button; do not disable user zoom.
8. Keep state in the hook; do not duplicate timestamps/rate in the page. Avoid unnecessary component splitting.
9. Update README with local use, timing rules, rounding, pause behavior, and verification limits.
10. Run the checks below and record results/source-review findings in the execution record.

## Validation

- `npm run test -- --run`: pure calculation/state-transition tests pass, including 300 BPM and rounding cases.
- `npm run typecheck`: no TypeScript errors.
- `npm run lint`: no lint errors.
- `npm run build`: static app and assets produced in `dist`.
- Source review: confirm one activation path, native semantics, held-key handling, accessible naming/output, focus styling, contrast choices, retained idle value, mobile sizing, safe areas, unchanged desktop structure, and zoom settings.
- Source review: no persistence, tap-data transmission, reset/mode controls, visible tap count, or new UI test dependencies.
- Record that actual layout, touch/keyboard, and screen-reader behavior remain untested under the user's pure-unit-test scope. Browser access is not a blocker.
