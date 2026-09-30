import { useCallback, useState } from "react"

import { INITIAL_BPM_COUNTER_STATE, recordTap } from "../bpm.utils"

export function useBpmCounter() {
  const [state, setState] = useState(INITIAL_BPM_COUNTER_STATE)

  const handleTap = useCallback(() => {
    const timestamp = performance.now()
    setState((currentState) => recordTap(currentState, timestamp))
  }, [])

  return { bpm: state.bpm, handleTap }
}
