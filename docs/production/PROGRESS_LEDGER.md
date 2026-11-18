# ARKVOID Progress Ledger

**Last updated:** 2026-11-18  
**Milestone:** Stage 00 — Foundation runtime

## Implemented in this milestone

- [x] Canonical repository instruction file and product/engineering/art/performance/IP constitutions.
- [x] Initial architecture decisions, runtime overview and production roadmap.
- [x] Vite + strict TypeScript + Three.js runtime entry point.
- [x] WebGL renderer, scene, camera, resize lifecycle, bounded frame delta and resource cleanup.
- [x] Procedural height-field with shared height function for rendering and player ground contact.
- [x] Lake basin, distant mountain forms, sect compound blockout and instanced vegetation/rocks.
- [x] Third-person player character blockout and follow camera.
- [x] Keyboard movement, pointer look, sprint, jump and mobile touch controls.
- [x] Qi motes, altar attunement, training effigy hit interaction and progression thresholds.
- [x] Versioned localStorage save with runtime validation, attunement state and collected-mote restoration.
- [x] Unit tests for terrain determinism, bounds, seeded randomness and progression.
- [x] GitHub Actions verification workflow.
- [x] First CI feedback addressed: added matching Three.js declarations and corrected strict index-signature property access.
- [x] Second CI feedback addressed in code: terrain position attribute now has an explicit runtime guard.

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

## Validation status

- Repository audit and file creation: completed through GitHub.
- GitHub Actions dependency installation: passed.
- First TypeScript check: failed on missing `@types/three`, strict indexed-property access and an unchecked geometry position attribute.
- Corrective commits: added `@types/three@0.187.0`, used bracket notation for external record/dataset properties, and guarded the geometry position attribute.
- A CI run for the terrain-guard fix is still required. Lint, formatter check, tests and production build have not yet been observed.
- CI now generates a lockfile on the runner and attempts to commit it to a same-repository PR branch; it also uploads the lockfile as an artifact for recovery.
- The authoring shell cannot resolve GitHub from its local network, so local clone and browser QA were not possible from this session.

## Next stage

1. Get a fresh CI result for the corrected PR head and fix any further failures.
2. Confirm `package-lock.json` is committed to the PR branch.
3. Launch the application in a browser and inspect desktop and touch layouts.
4. Add a collision/ground test scene and record a short playtest.
5. Replace the player blockout with the first original production character asset.
