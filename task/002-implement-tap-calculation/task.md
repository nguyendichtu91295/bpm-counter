# Task

## Goal

Implement deterministic tap-rate calculation, the state-owning React hook, and pure unit tests.

## Scope

Source plan: `plans/001-bpm-counter-mvp.md`, stage 2. Read the plan, requirements, workflow, and general coding conventions. Depends on `task-001-initialize-frontend` being DONE because it provides TypeScript, React, and Vitest.

No UI implementation or deployment. Use only pure unit tests; do not add hook/component tests or browser dependencies.

## Target Files

- `src/features/bpm/bpm.utils.ts`.
- `src/features/bpm/bpm.utils.test.ts`.
- `src/features/bpm/hooks/useBpmCounter.ts`.

## Steps

1. Follow the workflow's dependency checks and status transitions.
2. Define explicit state and constants: initial rate `0`, an empty timestamp array, maximum 5 accepted timestamps, minimum interval `100 ms`, and pause threshold `5000 ms`.
3. Implement a pure transition function receiving the previous state and an explicit millisecond timestamp. Do not mutate previous state.
4. Reject non-finite or non-increasing timestamps and intervals shorter than 100 ms. Ignored input must leave the window, last accepted timestamp, and rate unchanged. Exactly 100 ms is accepted.
5. First valid tap stores its timestamp and retains the current number. At 2–5 accepted taps, compute `60000 * (n - 1) / (last - first)`. Evict the oldest timestamp before calculating on subsequent taps.
6. Round only the displayed result to the nearest whole number. Do not round timestamps/intermediate intervals or average individual interval BPM values.
7. When the gap since the last accepted tap exceeds 5000 ms, start a new window containing only the current tap and retain the previous rate. The second accepted tap updates the result. Exactly 5000 ms remains in the old window.
8. Implement `useBpmCounter` with one state object and functional updates. Capture `performance.now()` in the interaction handler before passing it to the pure transition. No timers, reset control, persistence, or network calls. Reload starts at zero.
9. Add the unit cases below, run checks, and record results in the execution record.

## Validation

Run `npm run test -- --run src/features/bpm/bpm.utils.test.ts`, `npm run typecheck`, and `npm run lint`; all must pass.

Required deterministic unit cases:

- Initial state and first tap retain zero.
- Two taps 500 ms apart produce 120; five taps with the same spacing also produce 120.
- Two taps 1000 ms apart produce 60.
- Timestamps `0, 200, 400, 600, 800` produce 300 BPM and no rejected taps.
- Varying intervals use total elapsed time, not averaged interval rates.
- The sixth accepted tap drops the oldest; the window remains bounded at 5.
- Intervals below 100 ms are ignored; exactly 100 ms is valid.
- NaN, infinities, duplicate timestamps, and decreasing timestamps leave state unchanged.
- An ignored tap does not shift the timing reference for the next accepted tap.
- Exactly 5000 ms keeps the window; a greater gap replaces it with one tap and preserves the last rate.
- After a displayed 120 and a 6000 ms pause, the first new tap retains 120; a second tap 1000 ms later produces 60, without an intermediate zero.
- Two taps 490 ms apart round approximately 122.449 to 122; two taps 485 ms apart round approximately 123.711 to 124.
- State transitions preserve prior state and array contents.

Review hook ownership and functional updates directly; pure utility tests do not claim to verify React or browser interaction.
