# ARKVOID Physics, Collision and Navigation Evaluation

Date: 2026-11-18. Evidence legend: `[V]` primary page read this session, `[S]` secondary, `[K]` prior knowledge unverified, `[M]` measured in this session.

## Core design: physical collision is separate from character movement

A rigid-body engine does not give a good third-person controller by itself. Rapier's own docs say its built-in controller "may not suit every game, especially player characters" and that it does **not apply gravity** and does **not support rotation** [V]. ARKVOID therefore has three layers with an interface between each:

| Layer | Responsibility | Representation | Engine dependency |
|---|---|---|---|
| 1. World collision | Static terrain and architecture queries | Heightfield function + static AABB/trimesh colliders. **No simulated rigid bodies for static architecture.** | None (pure TS, `src/physics`, `src/world`) |
| 2. Character movement | Kinematic capsule: gravity, steps, slopes, snap-to-ground, jump | Own code (`src/player/playerController.ts`) behind a `CollisionWorld`-style interface | None |
| 3. Dynamic physics | Props, ragdolls, triggers, projectiles | Rigid bodies | Havok through Babylon (when first needed) |

This matches TD-007 (simulation never imports the render engine), which is what makes the engine decision cheap to act on.

## Measured: current Stage 01 controller (own code)
Node 22, Intel Xeon 2.1 GHz x2 (shared sandbox VM), compiled output, 2M steps after warm-up [M]:
- `stepPlayer`: **373 ns/step** (against a 16.67 ms frame at 60 Hz). Includes heightfield sample, 9 courtyard colliders, push-out and support-height queries.
- Heightfield sampling for one terrain chunk (33x33 vertices x 5 samples = 5,445 calls): **0.675 ms/chunk**. Excludes buffer allocation and GPU upload, so it is a lower bound for the 4 ms chunk-build budget.

Caveats: single-threaded micro-benchmark, one machine, no browser, collider count tiny. This shows the approach is cheap, not that it scales to a village of thousands of colliders. A spatial grid for static colliders is required before collider counts reach hundreds (Stage 02 task). **The Babylon/Havok integration itself was not benchmarked**: packages cannot be installed here. That benchmark is a Stage 02 gate (below).

## Candidates

### Havok via Babylon (`@babylonjs/havok` + `PhysicsAggregate`, `PhysicsCharacterController`)
- Setup per docs mirror: `import HavokPhysics from "@babylonjs/havok"; const h = await HavokPhysics(); scene.enablePhysics(gravity, new HavokPlugin(true, h))` [V]. ESM + UMD builds [V].
- Babylon's feature page lists a Havok Character Controller and ragdoll physics [V]. I could not load the character-controller doc page (not on the fetch allowlist), so its API (support states, slope parameters) is `[K]` only.
- **Licence:** a Babylon forum answer (2025-07-21) and the docs mirror say the web version is free to use under the MIT licence, including commercially [S/V-mirror]. The npm page I read states no licence field. **Gate:** read `node_modules/@babylonjs/havok/LICENSE` after install and record it in `LICENCE_REGISTER.md` before shipping.

### Rapier (`dimforge/rapier`, JS bindings under `bindings/typescript/`)
- Apache-2.0 [V]. Core crate at v0.35.3 (2026-08-28) per CHANGELOG [V]. The JS package version could not be confirmed: the npm registry is blocked here, and the only versions seen were 0.19.x (deterministic package) [S]. **Do not assume the JS bindings track the Rust core.**
- Character controller API [V, rapier.rs JS docs]: `world.createCharacterController(offset)`, `computeColliderMovement(collider, desiredTranslation, filterFlags?, filterGroups?, filterPredicate?)`, `computedMovement()`, `setMaxSlopeClimbAngle`, `setMinSlopeSlideAngle`, `enableAutostep(maxHeight, minWidth, includeDynamicBodies)`, `enableSnapToGround(distance)`, `setApplyImpulsesToDynamicBodies(true)`, `setUp`. Recommends cuboid/ball/capsule shapes.
- Core changelog notes relevant to a future server: `enhanced-determinism` can combine with `parallel`; cross-platform reproducibility still needs matching numeric features [V]. v0.35.0 fixed `grounded` flicker with snap-to-ground [V]. v0.35.0-beta.0 changed sleep defaults and rewrote CCD (breaking in Rust API) [V].
- The fetch of the `typescript` directory the brief linked was refused by GitHub (`robots_disallowed`); the README says the bindings live in `bindings/typescript/` [V].
- **Role:** engine-independent alternative. Strongest argument for it is a future authoritative Node server running the same simulation. It would be a second physics engine alongside Havok, which violates the no-fragile-collection rule. **Not adopted now**; re-open at Stage 07 with a benchmark.

### Navigation

| | navcat | recast-navigation-js | RecastNavigation (C++) |
|---|---|---|---|
| Licence | MIT [V] | not verified (page blocked) | zlib [V] |
| Nature | Pure JavaScript, tree-shakeable, JSON-serialisable, voxel pipeline "based on" Recast [V] | WASM build of Recast/Detour (basis of Babylon's NavigationPlugin V2) [S] | Reference implementation: Recast, Detour, DetourCrowd, DetourTileCache [V] |
| Evidence of fit | `generateSoloNavMesh`, `generateTiledNavMesh` (`navcat/blocks`), `findPath`, `findNearestPoly`, `moveAlongSurface`, `raycast`, `addTile`/`removeTile`, crowd + off-mesh connections, `navcat/three` entry [V]. Dynamic obstacles appear only as example names; no documented API in the part I read [V]. | Babylon NavigationPlugin V2 reports: tile-cache null-pointer error in addons v8.33.4, thin-instance NaN bounds, unreachable islands from voxelisation settings [S] | 1,184 commits, 109 open issues; no release shown [V] |
| Stats | 305 stars, 620 commits, 4 open issues [V] | n/a | 8.0k stars [V] |

**Direction (Stage 05/06, not added now):** build the navmesh with navcat from ARKVOID's own heightfield and collider geometry, independent of the render engine; stream it in tiles with a tile layout aligned to the 64 m terrain chunks (the idea DetourTileCache exists for, per the Recast README [V]). Required prototype before commitment: dynamic obstacle/tile-rebuild behaviour, tile rebuild cost per chunk, crowd agent counts. Babylon's NavigationPlugin V2 is not preferred: it adds a coupling to Babylon plus the reported issues, and the thread floats a future plugin based on navcat [S].

## Stage 02 physics gates
1. Introduce a `CollisionWorld` interface (terrain height, ray cast, capsule sweep, trigger queries) with the current implementation behind it, and a uniform spatial grid for static colliders. Test: 1,000 colliders, `stepPlayer` ≤ 50 µs/step in Node.
2. Port the controller test suite to run against the interface.
3. Havok enters only with the first dynamic prop. Benchmark in a real browser: 200 dynamic bodies awake, 2,000 static, 60 fps on Tier A, record numbers in the ledger.
4. Check `@babylonjs/havok` WASM size and load time against the 1.5 MB gzip initial JS budget (WASM is loaded lazily, count it separately).

## Sources
- https://www.rapier.rs/docs/user_guides/javascript/character_controller
- https://github.com/dimforge/rapier · https://github.com/dimforge/rapier/blob/master/CHANGELOG.md
- https://github.com/isaac-mason/navcat · https://github.com/recastnavigation/recastnavigation
- Havok plugin docs mirror: https://documentation-epx38z8s4-babylonjs.vercel.app/features/featuresDeepDive/physics/havokPlugin
- Havok licence thread: https://forum.babylonjs.com/t/havok-with-babylon-js-license-free-to/59637
- Navigation Plugin V2: https://forum.babylonjs.com/t/navigation-plugin-v2-is-here/60751?page=2
