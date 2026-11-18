# Progress Ledger

Status values: `done` (implemented, tested), `partial`, `placeholder`, `not started`. Never mark unimplemented work done.

## Stage 01 — 2026-11-18

| Feature | Status | Evidence / notes |
|---|---|---|
| Repo constitution + docs | done | `docs/` |
| Strict TS, lint, format, test, cycle tooling | done (config written) | Not executed in authoring environment: no network for `npm install`. Run `npm install && npm run check`. |
| WebGL renderer + game loop (fixed 60 Hz) | done (code written) | `src/game/game.ts`, `src/core/fixedStepper.ts` (unit-tested logic) |
| Third-person player movement | done (code written) | `src/player/playerController.ts`, unit tests |
| Terrain chunk streaming | done (code written) | `src/world/chunkManager.ts`, unit tests; chunks built/disposed around player |
| Collision | partial | Terrain ground + AABB colliders only. No slope limit, no dynamic bodies. |
| Courtyard structures | placeholder | Box primitives with real colliders; not art |
| Player avatar | placeholder | Capsule; no rig, no animation |
| Optional GLB avatar loading + fallback | done (code written) | `src/assets/assetLoader.ts`; no GLB exists yet |
| NPCs | not started | None exist |
| Combat, cultivation, sects, persistence | not started | |
| Water, vegetation, sky beyond gradient | not started | |
| Real-device performance measurement | not started | Targets only |
| Browser run of the game | not done | No browser/network in authoring environment |

## Stage 02 research — 2026-11-18

| Item | Status | Evidence / notes |
|---|---|---|
| Engine comparison and weighted matrix | done (research) | `docs/research/ENGINE_COMPARISON.md`; read READMEs, release posts, docs, forums; no engine code read, nothing run |
| Physics, navigation, asset, performance, repo, licence reviews | done (research) | `docs/research/*`; several sources blocked or unverified, flagged in each doc |
| Tech stack ADR | done (proposed, gated) | `docs/architecture/TECH_STACK_ADR.md` |
| Asset tooling (`tools/assets/`) | partial | Written, syntax-checked, no-asset path runs. Never run against a real GLB; packages not installed |
| Asset provenance | partial | One verified candidate (HDRI); no assets shipped; other candidates need re-checking |
| Babylon.js port | not started | Stage 02a |
| Havok / navcat / Rapier integration | not started | Gated |
| Simulation micro-benchmark (Node) | done | stepPlayer 373 ns, chunk heightfield sampling 0.675 ms; sandbox VM, not representative |
| Browser / real-device benchmarks | not started | |

## Stage 03 art direction — 2026-11-18

| Item | Status | Evidence / notes |
|---|---|---|
| Ten-image reference analysis + traceability matrix | done (documentation) | `docs/art-bible/USER_REFERENCE_ANALYSIS.md`; all ten images viewed |
| Visual identity, environment, architecture, character, creature, material, lighting, cinematic bibles | done (documentation) | `docs/art-bible/*`; design decisions are tagged `[D]` and not yet validated in engine |
| Reference register and acquisition rules | partial | External image research is thin: several image searches returned nothing; no credible photo set collected |
| Game and cultivation research | partial | Read: WWM letter and article, Black Myth Steam page, GoT landmarks, FFXVI article, genre primer. Not read: FFXIV, Lost Soul Aside, Sword of Justice, the six named cultivation works (individually) |
| Original design grammar (notch/span/ring, resonance scale) | proposed | Concept only; no in-engine implementation |
| Any 3D art, textures, character or creature model | not started | Nothing exists beyond Stage 01 blockout |
| Measurable art checks (colour budget, emissive cap, value structure) | not started | Need a screenshot harness |

## Measured performance
Node micro-benchmark only (see PERFORMANCE_RESEARCH.md). No browser or device numbers.

_(none yet)_
