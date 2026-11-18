# Technology Decision Register

| ID | Decision | Rationale | Alternatives rejected | Status |
|---|---|---|---|---|
| TD-001 | Browser runtime, WebGL2 via Three.js | Zero-install reach; mature glTF pipeline; team can ship now | Babylon.js (comparable, less ecosystem fit), Unity/Unreal WebGL export (heavy, opaque builds), raw WebGPU (immature support for target tiers) | Accepted |
| TD-002 | TypeScript strict | Typed boundaries between systems | JS | Accepted |
| TD-003 | Vite 6 | Fast dev server, simple prod build | Webpack (slower, more config) | Accepted |
| TD-004 | Vitest | Shares Vite config; fast | Jest (extra transform setup) | Accepted |
| TD-005 | ESLint 9 flat config + typescript-eslint + Prettier | Standard, enforceable | Biome (viable; revisit) | Accepted |
| TD-006 | madge for cycle detection | Enforces no circular deps in CI | Manual review | Accepted |
| TD-007 | Simulation code free of `three` imports | Enables unit tests and a future authoritative server | Mixed sim/render | Accepted |
| TD-008 | Custom lightweight collision (AABB + heightfield) | Sufficient for Stage 01; no dependency | Rapier (WASM; adopt when dynamic bodies/characters need it, Stage 03) | Accepted for now |
| TD-009 | Chunked heightfield terrain, 64 m chunks, 32×32 segments | Bounded memory, deterministic regeneration from seed | Single big mesh (not streaming) | Accepted |
| TD-010 | Fixed 60 Hz simulation step with accumulator | Deterministic movement, decoupled from render rate | Variable dt | Accepted |
| TD-011 | glTF 2.0 for all authored assets | Open standard, Three.js native | FBX/OBJ | Accepted |

## Stage 02 research outcomes
- TD-001 is **superseded in direction** by `TECH_STACK_ADR.md` (ADR-001, proposed, gated): Babylon.js 9.x replaces Three.js after the Stage 02 port. Three.js stays until then.
- TD-008 is refined: own collision stays; Havok joins only for dynamic bodies; Rapier deferred.
- TD-011 is refined: meshopt compression and KTX2 textures, gated by `npm run assets:validate`.

## Dependencies (Stage 01)
Runtime: `three`. Dev: `typescript`, `vite`, `vitest`, `eslint`, `@eslint/js`, `typescript-eslint`, `prettier`, `@types/three`, `madge`. All permissive licences (MIT).
Exact versions are fixed by `package-lock.json`, which must be generated with `npm install` and committed.
