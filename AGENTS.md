# AGENTS.md — instructions for coding agents working on ARKVOID

ARKVOID is a real 3D game (Vite + strict TypeScript + Three.js). It is **not** a website. Never build landing pages, galleries, or fake-3D CSS.

## Before you start
1. Read `docs/constitution/*` and `docs/production/PROGRESS_LEDGER.md` and `ROADMAP.md`.
2. Inspect the repo state; do not overwrite working code blindly.

3. For any art, environment, character, creature or asset work, read `docs/art-bible/VISUAL_IDENTITY.md` first, then the relevant bible. Reference images are never shipped (see `docs/art-bible/REFERENCE_REGISTER.md`).

## Rules
- Folder boundaries and dependency direction: `ENGINEERING_CONSTITUTION.md`. Sim code (`physics`, `player`, `world/*` pure modules) never imports `three`.
- Tunables go in `src/config`. No magic numbers in systems.
- Log via `createLogger`; no `console.*`.
- No per-frame allocations in simulation hot paths; no DOM writes per frame.
- Every asset needs an `ASSET_REGISTER.md` row.
- New dependency → entry in `TECHNOLOGY_DECISIONS.md`.

## Definition of done
`npm run check` and `npm run build` pass; the game runs; ledger updated honestly (`done` / `partial` / `placeholder` / `not started`).

## Continuing work
Pick the next stage in `ROADMAP.md`. Keep the repo working between commits. At stage end, update the ledger and write a status report: files created/modified, dependencies, tests run, build result, blockers, next stage. State environment limitations plainly instead of claiming success.
