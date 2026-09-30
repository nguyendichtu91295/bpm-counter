# BPM Counter Requirements

## Overview

Build a frontend web application that helps runners estimate a repeated event's rate per minute from manual taps without needing a Garmin or other dedicated device. Users can tap along with heartbeats or running steps; the calculation is the same, but heart rate is measured in beats per minute and running cadence in steps per minute.

## Core Functionality

- Provide a prominent button that the user can tap in time with each heartbeat or each running step.
- Record the timing between button taps.
- Calculate the tapped event's rate per minute.
- Display the calculated BPM clearly on the page.

## User Flow

1. The user opens the page and sees a short instruction explaining that they should tap once for every heartbeat or every step. For cadence, count both left and right steps.
2. The user taps the main button repeatedly during a measurement session.
3. After enough taps have been recorded, the app displays the current BPM estimate.
4. The user continues tapping while the app continuously updates the current estimate.

## Measurement Rules

- Start calculating after 2 valid taps, using up to the most recent 5 valid taps to smooth the estimate.
- Normalize the rate to a 60-second value using elapsed time between the first and last tap in the window: `(tapCountInWindow - 1) / elapsedSeconds * 60`.
- On initial page load, display `0` until 2 valid taps are available.
- Update the BPM after each additional valid tap while keeping the measurement running forward.
- Ignore clearly invalid intervals, such as accidental double-taps, and document the chosen minimum interval in the implementation.
- Do not provide a reset control in the MVP. The app continuously counts taps for the current session.
- When tapping stops, keep the last calculated BPM visible; do not reset it to `0`.
- If the gap since the last valid tap exceeds 5 seconds, the next tap starts a fresh measurement window. Exclude the pause and all earlier taps from the new calculation.
- Keep the previous BPM visible after the first tap in a fresh window; update it once the second valid tap arrives. A gap of exactly 5 seconds does not start a fresh window.

## UI States

- Initial state: show instructions and a BPM display initialized to `0`.
- Measuring state: show the live BPM estimate when available.
- The primary tap target must be large and easy to use while running on a mobile screen.
- Keep the UI minimal: one primary tap button and one prominent BPM number, with only essential supporting text.

## Safety and Scope

- Clearly describe the result as an estimate based on manual taps, not a medical measurement.
- No account, backend, or external heart-rate device integration is required for the MVP.
- Do not store or transmit measurement data; keep the session in browser memory only.

## Accessibility and Compatibility

- The main tap control must be keyboard accessible and have an accessible label.
- Do not rely on color alone to communicate the measurement state.
- Design mobile-first and optimize for phone use.
- On desktop, scale the same mobile layout up without introducing a different layout or desktop-only interaction.

## Intended User

Runners who want to estimate heart rate or running cadence from manual taps without a Garmin or similar device.

## Technical Preferences

- UI component library: shadcn/ui.
- Frontend: Vite + React.
- Deployment: Vercel under the `coding-challenge` team, following the same deployment approach as Coding Challenge Problem 2.
- Vercel project name: `bpm-counter`, matching the GitHub repository `nguyendichtu91295/bpm-counter`.

## MVP Acceptance Criteria

- A user can start tapping immediately after opening the page.
- The page contains a primary tap button and a prominent BPM number.
- On initial page load, the BPM remains `0` until 2 valid taps are recorded, then updates using up to the latest 5 taps as a taps-per-60-seconds rate.
- Two taps 0.5 seconds apart produce 120 BPM; five taps with the same spacing also produce 120 BPM.
- The estimate updates after each additional valid tap without resetting the session.
- The last calculated BPM remains visible when tapping stops.
- After a gap longer than 5 seconds, the first new tap preserves the last BPM and starts a fresh window; the second valid tap updates the result using only the new window. For example, after displaying 120 BPM and pausing for 6 seconds, two new taps 1 second apart change the display to 60 BPM without displaying `0` in between.
- The page is mobile-first, keyboard accessible, minimal, and available online through Vercel.
