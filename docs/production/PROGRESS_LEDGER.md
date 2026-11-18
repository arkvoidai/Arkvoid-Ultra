# ARKVOID Progress Ledger

**Last updated:** 2026-11-18  
**Milestone:** Stage 00 — Foundation runtime

## Implemented in this milestone

- [x] Canonical repository instruction file and product/engineering/art/performance/IP constitutions.
- [x] Initial architecture decisions and production roadmap.
- [x] Vite + strict TypeScript + Three.js runtime entry point.
- [x] WebGL renderer, scene, camera, resize lifecycle, bounded frame delta and resource cleanup.
- [x] Procedural height-field with shared height function for rendering and player ground contact.
- [x] Lake basin, distant mountain forms, sect compound blockout and instanced vegetation/rocks.
- [x] Third-person player character blockout and follow camera.
- [x] Keyboard movement, pointer look, sprint, jump and mobile touch controls.
- [x] Qi motes, altar attunement, training effigy hit interaction and progression thresholds.
- [x] Versioned localStorage save with runtime validation and failure handling.
- [x] Unit tests for terrain determinism, bounds, seeded randomness and progression.
- [x] CI workflow for typecheck, lint, tests, formatting and build.

## Explicitly not implemented

- [ ] Production-quality human character model, facial rig, cloth simulation or mocap animation.
- [ ] Production environment assets, terrain texturing pipeline or final water rendering.
- [ ] Production combat framework, hitbox/hurtbox system, enemy AI or creature encounter.
- [ ] AI-driven NPCs, schedules, dialogue memory or persistent faction simulation.
- [ ] World-cell streaming, LOD pipeline, large-world origin management or offline simulation.
- [ ] Server backend, authentication, authoritative persistence, multiplayer or economy.
- [ ] Audio, final VFX, accessibility settings and remappable controls.
- [ ] Device performance validation on representative desktop and mobile hardware.
- [ ] Browser visual QA session or recorded gameplay capture.

## Known engineering caveats

- The world and player are procedural blockouts. Their purpose is to prove scene assembly, control and interaction paths.
- Collision currently consists of a shared terrain height function and simple circular tree blockers. It is not a general rigid-body physics system.
- Saves live in browser localStorage and are not secure, portable or server-authoritative.
- The environment is loaded as one scene; there is no streaming.
- The first character/animation implementation is deliberately lightweight.
- Direct dependency versions are exact-pinned, but a package lockfile has not been generated. The first npm-enabled environment must generate and commit `package-lock.json` before release or production deployment.

## Validation status for this change

The authoring environment could not resolve GitHub from its local shell, so a local clone, npm install, local typecheck, lint, test run and production build were not possible during creation. The repository CI workflow is included to run those checks in GitHub Actions after the branch is pushed. These checks are not marked passed until an actual workflow result is observed.

## Next stage

1. Run CI and fix all type/lint/test/build failures.
2. Generate and commit the npm lockfile in a network-enabled environment.
3. Launch the actual application in a browser and inspect desktop and touch layouts.
4. Add a collision/ground test scene and record a short playtest.
5. Replace the player blockout with the first original production character asset.
