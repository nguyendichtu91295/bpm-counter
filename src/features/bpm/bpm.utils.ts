export const MAX_TAP_TIMESTAMPS = 5
export const MIN_TAP_INTERVAL_MS = 100
export const PAUSE_RESET_THRESHOLD_MS = 5000

export interface BpmCounterState {
  tapTimestamps: readonly number[]
  bpm: number
}

export const INITIAL_BPM_COUNTER_STATE: BpmCounterState = {
  tapTimestamps: [],
  bpm: 0,
}

/** Accepts a timestamp and returns the next immutable counter state. */
export function recordTap(state: BpmCounterState, timestamp: number): BpmCounterState {
  if (!Number.isFinite(timestamp)) return state

  const lastTimestamp = state.tapTimestamps.at(-1)
  if (lastTimestamp !== undefined) {
    const interval = timestamp - lastTimestamp
    if (interval <= 0 || interval < MIN_TAP_INTERVAL_MS) return state

    if (interval > PAUSE_RESET_THRESHOLD_MS) {
      return { tapTimestamps: [timestamp], bpm: state.bpm }
    }
  }

  const tapTimestamps = [...state.tapTimestamps, timestamp].slice(-MAX_TAP_TIMESTAMPS)
  if (tapTimestamps.length < 2) return { tapTimestamps, bpm: state.bpm }

  const elapsedMs = tapTimestamps.at(-1)! - tapTimestamps[0]
  const bpm = Math.round((60_000 * (tapTimestamps.length - 1)) / elapsedMs)

  return { tapTimestamps, bpm }
}
