# ADR-001: ARKVOID Technology Stack

Status: **Proposed, gated.** Date: 2026-11-18. Evidence: `docs/research/*`. Nothing below has been run against the real engine; the gates decide.

## Decision
| Area | Choice | Notes |
|---|---|---|
| Language / build | Strict TypeScript, Vite, Vitest (unchanged from Stage 01) | |
| Render engine | **Babylon.js 9.x** (`@babylonjs/core`, `@babylonjs/loaders`), explicit ES imports | WebGL2 default; WebGPU opt-in after measurement |
| Simulation | Own pure-TS code: heightfield, static colliders, kinematic character controller | Engine-independent (TD-007) |
| Dynamic physics | Havok via `@babylonjs/havok`, only when the first dynamic prop is needed | Package licence must be read at install |
| Navigation | navcat (MIT), Stage 05/06, after prototype | Not added now |
| Asset pipeline | glTF Transform + meshoptimizer + Khronos glTF Validator (dev tools), meshopt compression, KTX2 textures | Scripts in `tools/assets/` |
| Asset sources | Poly Haven / ambientCG (CC0), in-house, each recorded in `assets/ASSET_PROVENANCE.md` | |

## Rejected or deferred
Three.js (fallback only if size gate fails), PlayCanvas, Babylon Lite (WebGPU-only, young; quarterly re-evaluation), Rapier (alternative if an authoritative server needs shared physics; Stage 07), Babylon Editor (not in build), CesiumJS (wrong domain), recast-navigation-js (reference only).

## Gates (the decision is reversed or revised if one fails)
1. **Size:** Babylon port of the Stage 01 scene ≤ 1.5 MB gzip initial JS, no Inspector in production.
2. **Frame:** Port holds Tier A budgets in `PERFORMANCE_CONSTITUTION.md` on the benchmark route.
3. **Mobile:** WebGPU stays off by default until measured on Tier B/C devices.
4. **Physics:** Havok browser benchmark (200 awake dynamic, 2,000 static, 60 fps Tier A) and package licence recorded.
5. **Licence:** all UNVERIFIED rows in `LICENCE_REGISTER.md` resolved before the dependency is added.

## Migration plan
1. Stage 02a: add `@babylonjs/core` and `@babylonjs/loaders`. Pin exact versions from `npm view`. Port `src/game`, `terrainMesh`, `assets`, `ui` render code. Simulation modules are untouched.
2. Stage 02b: remove `three` and `@types/three`. Measure gates 1–2 and record in the ledger.
3. Stage 02c: introduce a `CollisionWorld` interface and a spatial grid (see PHYSICS_EVALUATION.md).
4. Only then evaluate WebGPU, Havok, KTX2.

## Dependency list
Current: `three` (to be removed in 02b). Dev: as Stage 01 plus, when the asset tooling is first run: `@gltf-transform/cli`, `@gltf-transform/core`, `@gltf-transform/extensions`, `gltf-validator`, `meshoptimizer`. Planned: `@babylonjs/core`, `@babylonjs/loaders`; later `@babylonjs/havok`, `navcat`. **No version numbers were verified** (npm registry blocked here); pin with `npm view <pkg> version` and commit the lockfile.

## Consequences
Positive: one engine with physics, animation and tooling built in; simulation stays portable. Negative: larger bundle than Three.js, an engine port in Stage 02 that delays gameplay work, and experimental large-world support.
