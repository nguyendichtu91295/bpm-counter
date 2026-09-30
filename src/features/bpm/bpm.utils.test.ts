import { describe, expect, it } from "vitest"

import {
  INITIAL_BPM_COUNTER_STATE,
  MAX_TAP_TIMESTAMPS,
  MIN_TAP_INTERVAL_MS,
  PAUSE_RESET_THRESHOLD_MS,
  recordTap,
  type BpmCounterState,
} from "./bpm.utils"

function tapAt(timestamps: number[], nextTimestamp: number): BpmCounterState {
  return recordTap(
    timestamps.reduce(recordTap, INITIAL_BPM_COUNTER_STATE),
    nextTimestamp,
  )
}

describe("recordTap", () => {
  it("starts at zero and keeps zero after the first tap", () => {
    expect(INITIAL_BPM_COUNTER_STATE).toEqual({ tapTimestamps: [], bpm: 0 })
    expect(tapAt([], 1000)).toEqual({ tapTimestamps: [1000], bpm: 0 })
  })

  it("calculates from two taps and remains accurate across five evenly spaced taps", () => {
    expect(tapAt([1000], 1500).bpm).toBe(120)
    expect(tapAt([1000, 1500, 2000, 2500], 3000).bpm).toBe(120)
  })

  it("calculates one-minute rate using elapsed time across the full window", () => {
    expect(tapAt([0], 1000).bpm).toBe(60)
    // The intervals individually indicate 120 BPM and 60 BPM; total elapsed rate is 80 BPM.
    expect(tapAt([0, 500], 1500).bpm).toBe(80)
  })

  it("supports 300 BPM with 200 ms between five taps", () => {
    const state = tapAt([0, 200, 400, 600], 800)
    expect(state.bpm).toBe(300)
    expect(state.tapTimestamps).toEqual([0, 200, 400, 600, 800])
  })

  it("retains only the most recent five accepted taps", () => {
    const state = tapAt([0, 500, 1000, 1500, 2000], 2500)
    expect(state.tapTimestamps).toEqual([500, 1000, 1500, 2000, 2500])
    expect(state.tapTimestamps).toHaveLength(MAX_TAP_TIMESTAMPS)
    expect(state.bpm).toBe(120)
  })

  it("rejects too-fast, non-finite, duplicate, and decreasing timestamps without changing state", () => {
    const state = tapAt([1000], 1500)
    for (const invalidTimestamp of [1549, NaN, Infinity, -Infinity, 1500, 1499]) {
      expect(recordTap(state, invalidTimestamp)).toBe(state)
    }
  })

  it("accepts exactly the minimum tap interval", () => {
    expect(tapAt([1000], 1000 + MIN_TAP_INTERVAL_MS).bpm).toBe(600)
  })

  it("does not let an ignored tap shift the interval reference", () => {
    const first = recordTap(INITIAL_BPM_COUNTER_STATE, 0)
    const ignored = recordTap(first, 50)
    expect(ignored).toBe(first)
    expect(recordTap(ignored, 500)).toEqual({ tapTimestamps: [0, 500], bpm: 120 })
  })

  it("keeps the current window at exactly five seconds", () => {
    const state = tapAt([0], 500)
    const continued = recordTap(state, 500 + PAUSE_RESET_THRESHOLD_MS)
    expect(continued.tapTimestamps).toEqual([0, 500, 5500])
    expect(continued.bpm).toBe(22)
  })

  it("starts a fresh window after a pause and retains the last result until a new pair arrives", () => {
    const prior = tapAt([0], 500)
    const firstAfterPause = recordTap(prior, 500 + PAUSE_RESET_THRESHOLD_MS + 1)
    expect(firstAfterPause).toEqual({ tapTimestamps: [5501], bpm: 120 })

    const secondAfterPause = recordTap(firstAfterPause, 6501)
    expect(secondAfterPause).toEqual({ tapTimestamps: [5501, 6501], bpm: 60 })
  })

  it("rounds only the displayed rate to the nearest whole number", () => {
    expect(tapAt([0], 490).bpm).toBe(122)
    expect(tapAt([0], 485).bpm).toBe(124)
  })

  it("does not mutate the input state or timestamp array", () => {
    const original: BpmCounterState = { tapTimestamps: [100, 600], bpm: 120 }
    const originalTimestamps = [...original.tapTimestamps]
    const next = recordTap(original, 1100)

    expect(original.tapTimestamps).toEqual(originalTimestamps)
    expect(original.bpm).toBe(120)
    expect(next).not.toBe(original)
    expect(next.tapTimestamps).not.toBe(original.tapTimestamps)
  })
})
