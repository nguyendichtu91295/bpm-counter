# BPM Counter

A small mobile-first BPM counter with a tap button and a rate display. The displayed value starts at zero and updates from the second valid tap.

Live app: [bpm-counter-nine.vercel.app](https://bpm-counter-nine.vercel.app)

The rate is calculated over the elapsed time between up to the latest five taps and rounded to the nearest whole number. Taps less than 100 ms apart are ignored. A pause longer than five seconds starts a fresh calculation window while keeping the previous value visible until two new taps arrive. Reloading starts a new session. No measurements are stored or sent anywhere.

## Development

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```

Automated tests cover only the pure timing and calculation rules. UI and real-device interaction are not automated or manually validated as part of this MVP task flow.

## Deployment

The Vercel target is team `coding-challenge`, project `bpm-counter`, connected to `nguyendichtu91295/bpm-counter`. `vercel.json` sets Vite, `npm ci`, `npm run build`, and `dist`.
