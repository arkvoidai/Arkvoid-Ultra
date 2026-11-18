# ARKVOID Technology Decision Register

## ADR-001 — Browser-first Three.js runtime

**Status:** Accepted for the first playable prototype.

**Decision:** Use Three.js directly with Vite and strict TypeScript. Keep the render and simulation loop imperative. The project does not introduce React into the game runtime.

**Reasons:** The immediate acceptance target is a browser-runnable third-person 3D prototype, including mobile browser input. Three.js provides scene, camera, geometry, lighting and WebGL rendering primitives without committing the early project to a large game-engine export pipeline. An imperative loop keeps frame ownership explicit.

**Consequences:** The team owns character movement, collision, scene lifecycle, content pipeline and gameplay systems. Three.js is not a complete game engine. Re-evaluate a native engine only against measured product and platform constraints, not preference.

## ADR-002 — Vite as application/build host

**Status:** Accepted.

**Decision:** Use Vite for local development, TypeScript bundling and static production output.

**Reasons:** Fast browser feedback and a small application surface. The initial runtime is client-rendered and has no server requirement.

**Consequences:** Deployment requires static hosting with correct asset paths. Vite is build infrastructure, not a world simulation service.

## ADR-003 — Strict TypeScript domain boundaries

**Status:** Accepted.

**Decision:** Strict TypeScript, explicit interfaces at subsystem boundaries and a separate HUD adapter.

**Reasons:** Input, world, save and progression code should evolve without hidden shape assumptions.

**Consequences:** Runtime validation is still required for JSON and browser storage. Compile-time types do not validate untrusted data.

## ADR-004 — Analytic terrain function for first prototype

**Status:** Accepted for Stage 00 only.

**Decision:** The rendered height-field and player ground contact use the same deterministic analytic height function.

**Reasons:** This proves coherent geometry/ground contact with no imported assets and allows fast tests.

**Consequences:** This is not a production terrain system. Streaming, erosion, authored control maps, collision meshes and LOD are future decisions.

## ADR-005 — Lightweight kinematic movement

**Status:** Accepted for Stage 00 only.

**Decision:** Use a bounded kinematic player controller with terrain-height contact and simple circular obstacle checks.

**Reasons:** It reduces early dependencies and makes the current movement loop inspectable.

**Consequences:** It is not suitable for complex rigid-body interaction or production combat. Evaluate Rapier or an equivalent physics system before implementing advanced combat, moving platforms or complex collision.

## ADR-006 — Local versioned save during prototype

**Status:** Accepted with explicit limitations.

**Decision:** Use a versioned localStorage record for prototype progression.

**Reasons:** It allows immediate session continuity without introducing an unfinished backend.

**Consequences:** Local data is user-controlled, device-local and untrusted. It must not hold purchased value, competitive progression or security-sensitive state. A server-authoritative persistence architecture is required before those features exist.

## ADR-007 — Exact direct dependency pins and npm lockfile

**Status:** Accepted.

**Decision:** Pin direct packages exactly and use Node 26 in CI.

**Reasons:** Avoid silent direct-dependency upgrades. The selected toolchain uses Vite 8.3.8, Three.js 0.187.0, `@types/three` 0.187.0, TypeScript 6.0.3, Vitest 5.1.0, ESLint 10.15.0 and typescript-eslint 8.73.0. TypeScript 6.0.3 is used because the selected TypeScript ESLint integration does not yet declare TypeScript 7 compatibility.

**Consequence / open action:** The authoring shell has no outbound DNS/network access. GitHub Actions now installs dependencies and attempts to commit the exact generated package lock to same-repository PR branches. Verify that commit and use `npm ci` as the standard install path before production deployment.
