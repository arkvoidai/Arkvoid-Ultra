# ARKVOID Engineering Constitution

## Runtime architecture

- One browser-first application and one primary runtime.
- TypeScript strict mode for gameplay, rendering and application code.
- Three.js owns scene graph, meshes, camera, materials and rendering.
- Game simulation is imperative and runs from a single bounded frame loop.
- DOM HUD code is an adapter over runtime state; it does not own gameplay.
- No React render work, state-store notification storm or network request belongs inside the frame loop.
- Rendering, input, world generation, character control, gameplay systems and persistence remain separate modules.

## Code organisation

- `src/game/world`: terrain functions, deterministic world dressing and environment assembly.
- `src/game/character`: player representation and animation adapter.
- `src/game/input`: keyboard, pointer and virtual-control translation.
- `src/game/systems`: progression, persistence and future gameplay services.
- `src/ui`: DOM presentation and accessible control surfaces.
- `src/styles`: game HUD styling only.
- `tests`: deterministic logic tests and future integration tests.

## Type and state discipline

- No implicit `any`; no unvalidated JSON casts at external boundaries.
- Persisted data must include a schema version and pass runtime validation.
- Use explicit interfaces for input frames, save records, colliders and gameplay snapshots.
- One-shot inputs are queued and consumed once. Held controls remain held until released or focus is lost.
- Random world dressing uses a supplied seed.
- Do not scatter gameplay thresholds through rendering code.

## Runtime safety

- Clamp frame delta to protect simulation after tab suspension.
- Handle unavailable WebGL and unavailable local storage.
- Dispose GPU resources, event listeners, observers and animation loops.
- Avoid unbounded scene growth and per-frame object allocation where practical.
- Keep asset loading asynchronous, cancellable and observable when an asset pipeline is introduced.
- Never expose credentials in client bundles or commit secrets.

## Dependency policy

- Pin direct dependency versions exactly.
- Commit a package-manager lockfile before release or production deployment.
- New runtime dependencies require an architecture note: capability, alternatives, bundle/runtime cost, licence and maintenance risk.
- Avoid engine dependencies that duplicate existing capabilities without a clear benefit.
- Review dependency and browser support when upgrading the toolchain.

## Quality gates

The required local gate is `npm run verify`: typecheck, lint, formatter check, automated tests and production build. CI runs the same command on pull requests and pushes to main.

A passing build is not proof of visual quality or device performance. Those require browser/device testing and recorded evidence.
