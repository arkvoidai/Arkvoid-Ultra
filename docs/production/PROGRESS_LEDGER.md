# ARKVOID Progress Ledger

**Last updated:** 2026-11-18  
**Milestone:** Stage 00 — Foundation runtime

## Implemented in this milestone

- [x] Canonical repository instructions and product, engineering, art, performance and IP constitutions.
- [x] Architecture decisions, runtime overview and production roadmap.
- [x] Vite, strict TypeScript and Three.js runtime entry point.
- [x] WebGL renderer, scene, camera, resize lifecycle and bounded frame delta.
- [x] Procedural height-field with shared height logic for geometry and player ground contact.
- [x] Lake basin, distant mountain forms, sect-compound blockout and instanced vegetation and rocks.
- [x] Third-person player-character blockout and follow camera.
- [x] Keyboard movement, pointer look, sprint, jump and mobile touch controls.
- [x] Qi motes, altar attunement, training-effigy interaction and progression thresholds.
- [x] Versioned localStorage save with validation, attunement state and collected-mote restoration.
- [x] Deterministic logic tests and GitHub Actions verification.
- [x] Exact dependency lockfile committed to the repository.
- [x] Canonical Prettier formatting applied to the repository.

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

- The world and player are procedural blockouts. They prove scene assembly and interaction paths, not final art quality.
- Collision uses a shared terrain height function and simple circular tree blockers. It is not a general rigid-body physics system.
- Saves use browser localStorage and are not secure, portable or server-authoritative.
- The environment loads as one scene; there is no world streaming.
- Character animation is a lightweight procedural placeholder.
- The first production build contains a 571.57 KB minified JavaScript chunk (144.45 KB gzipped). Vite reports that the uncompressed chunk exceeds its 500 KB advisory threshold; profile and split the runtime before adding substantial content.

## Validation results

GitHub Actions `Game Runtime CI` completed successfully on the foundation implementation:

- [x] `npm ci` — dependency installation passed.
- [x] `npm run typecheck` — strict TypeScript check passed.
- [x] `npm run lint` — ESLint passed.
- [x] `npm run format:check` — Prettier check passed.
- [x] `npm run test` — 2 test files, 8 tests passed.
- [x] `npm run build` — Vite production build passed (16 modules transformed).

The build emitted the documented chunk-size advisory, not a build failure. Browser visual QA and real-device performance testing were not performed in this environment.

## Next stage

1. Run the game in a browser on desktop and mobile and record a playtest.
2. Profile the first valley at representative resolutions; establish p50 and p95 frame times.
3. Split and optimise runtime code before adding substantial content or assets.
4. Replace the player blockout with an original rigged character and production animation set.
5. Begin the combat/interaction system and first creature encounter.
