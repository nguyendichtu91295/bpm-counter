import type { KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { useBpmCounter } from "@/features/bpm/hooks/useBpmCounter"

export function BpmPage() {
  const { bpm, handleTap } = useBpmCounter()

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault()
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-between bg-background px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-foreground">
      <header className="pt-2 text-center">
        <p className="text-xs font-semibold tracking-[0.22em] text-foreground/55">BPM COUNTER</p>
      </header>

      <section
        aria-labelledby="page-title"
        className="flex w-full max-w-lg flex-col items-center gap-9 py-8 text-center sm:gap-11"
      >
        <div className="space-y-2">
          <h1 id="page-title" className="text-lg font-medium text-foreground/70">
            Your current pace
          </h1>
          <p className="tabular-nums leading-none tracking-[-0.075em] text-foreground" style={{ fontSize: "clamp(5rem, 27vw, 9rem)" }}>
            {bpm}
            <span className="ml-2 align-baseline text-base font-semibold tracking-normal text-foreground/55 sm:text-xl">
              BPM
            </span>
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          aria-label="Record one heartbeat or running step"
          aria-describedby="tap-instructions"
          className="aspect-square w-[min(72vw,18rem)] rounded-full bg-primary text-2xl shadow-[0_18px_45px_-20px_oklch(0.25_0.05_255/0.55)] touch-manipulation active:scale-[0.98]"
          onClick={handleTap}
          onKeyDown={handleKeyDown}
        >
          Tap
        </Button>

        <div className="max-w-sm space-y-2 px-2">
          <p id="tap-instructions" className="text-sm leading-6 text-foreground/75 sm:text-base">
            Tap once for each heartbeat, or once for every step—left and right.
          </p>
          <p className="text-xs leading-5 text-foreground/55 sm:text-sm">
            A manual estimate, not a medical measurement.
          </p>
        </div>
      </section>

      <footer aria-hidden="true" className="h-5" />
    </main>
  )
}
