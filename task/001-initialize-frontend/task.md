# Task

## Goal

Initialize the React + TypeScript + Vite foundation for the BPM counter, with shadcn/ui and reproducible build tooling.

## Scope

Source plan: `plans/001-bpm-counter-mvp.md`, stage 1. Read that plan, `requirements.md`, `.ai/ai_workflow.md`, and `.ai/coding_convention.md` before execution. Work at the BPM workspace root, preserve existing files, and apply only the general conventions from the post-feed examples.

Prepare the scaffold and local deployment configuration. Calculation, final UI, and publishing belong to later tasks. Test coverage is pure unit tests only; do not introduce component tests, browser automation, or a mandatory manual UI test stage.

## Target Files

- `package.json`, `package-lock.json`, `index.html`.
- `vite.config.ts`, `tsconfig*.json`, `eslint.config.*`.
- `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`.
- `src/main.tsx`, `src/App.tsx`, `src/styles.css`.
- `.gitignore`, `vercel.json`, `README.md`.

## Steps

1. Confirm this task is PENDING and follow the workflow's RUNNING/execution-record/status transitions.
2. Inspect existing files and runtime versions. Resolve compatible tooling versions from official documentation/package metadata; record installed versions in the npm lockfile.
3. Scaffold Vite + React + TypeScript in place without overwriting requirements, plans, task records, or local Vercel files.
4. Add minimal shadcn/ui styling, its button, and required utilities/dependencies. Set up aliases consistently for TypeScript, Vite, and shadcn/ui.
5. Provide scripts: `dev`, `build`, `preview`, `typecheck`, `lint`, and `test`. Configure Vitest for pure unit tests in a Node environment; no DOM test libraries. Do not add placeholder tests just to pass an empty suite.
6. Extend ignore rules for `node_modules/`, `dist/`, and generated compiler output, preserving `.vercel` and `.env*`.
7. Add `vercel.json` with Vite framework, install command `npm ci`, build command `npm run build`, and output directory `dist`. Do not deploy or change remote settings in this task.
8. Document local commands and intended deployment settings in README.
9. Run validation and record commands, outcomes, files changed, and any limitations in `execution.md`.

## Validation

- `npm ci`: installation succeeds from the lockfile.
- `npm run typecheck`: no TypeScript errors.
- `npm run lint`: no lint errors.
- `npm run build`: produces `dist/index.html` and built assets.
- `git check-ignore .vercel/project.json .env.local node_modules/ dist/`: all generated/sensitive paths are ignored when Git is available; otherwise inspect ignore rules directly.
- Inspect package scripts and Vitest configuration; the test suite begins in task 002, so do not report tests as passed in this task.
