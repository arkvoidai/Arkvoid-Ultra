# ARKVOID Engine Comparison

Date: 2026-11-18. Author: ARKVOID R&D.

**Evidence legend.** `[V]` read from a primary page (repo, official blog, official docs) in this session. `[S]` secondary source (forum, third-party article); treat as indicative. `[K]` prior knowledge, not re-verified; must be confirmed before it drives a decision.

**Limits of this study.** No packages could be installed (network off for the shell), so nothing here was run. I read READMEs, manifests, release posts, docs mirrors and forum threads. I did not read engine class implementations. Scores below are my judgement from that evidence, not measurements.

## Candidates and current state

| | Babylon.js | Three.js | PlayCanvas engine | Babylon Editor |
|---|---|---|---|---|
| Upstream | github.com/BabylonJS/Babylon.js | github.com/mrdoob/three.js | github.com/playcanvas/engine | github.com/BabylonJS/Editor |
| Licence | Apache-2.0 [V] | MIT [V] | MIT [V] | Apache-2.0 [V] |
| Version seen | 9.0 released 2026-03-26 [V]; `@babylonjs/core` 9.27.1 in a Sept 2026 article [S] | r186 (24 Sep) [V] | `playcanvas` 2.22.4 (Sept 2026) [S]; v2.23.0 exists [S] | v5.5.0 listed [V] |
| Stars | 26.3k [V] | 117.2k [V] | 17.2k [V] | 1.1k [V] |
| WebGL2 / WebGPU | WebGL1/2 + WebGPU; native WGSL core shaders [V] | WebGL2 + WebGPU renderers; `three/webgpu` auto-falls back to WebGL2 [V/S] | "built on WebGL2 and WebGPU" [V]; WebGPU labelled beta in official docs [S] | n/a (editor) |
| Built-in game systems | Havok physics + character controller, ragdoll, animation retargeting, audio, XR, navmesh plugin [V] | None: no physics, audio or game loop [S] | Ammo.js physics, cloud editor [S] | Desktop scene editor (Win/macOS/Linux) [V] |
| Bundle (gzip) | ~1.8 MB for all of `@babylonjs/core` before tree-shaking [S]; a PBR BoomBox scene is 675 KB gzip [V, maintainers' number] | ~185 KB (`three`), ~300 KB (`three/webgpu`) [S] | ~615 KB full engine [S] | n/a |

Babylon 9.0 headline features [V]: clustered lighting (WebGL2 and WebGPU), volumetric lighting (WebGPU compute with WebGL2 fallback), Frame Graph v1 (maintainers cite ≥40% GPU memory savings in some cases), animation retargeting, area lights, Gaussian splats. Large World Rendering (`useLargeWorldRendering`, floating origin + 64-bit CPU matrices) is **experimental** [V].

### The new factor: Babylon Lite [V, forum announcement 2026-06-17]
A WebGPU-only, data-oriented, tree-shakable renderer from the Babylon team. Maintainer benchmarks: ~19x less gzip JS, ~3.6x faster frames, ~5x less memory (BoomBox: 34 KB vs 675 KB). **No WebGL fallback by design**; API compatibility is "explicitly not a first-class goal"; feature set is narrower; licence not stated on the page I could read; the team says Babylon.js remains "the right default for most projects" [V]. Forum: Android WebGPU results vary by device; one tester found a Pixel 5 faster on WebGL2 [S]. A May 2026 report describes WebGPU "device lost" and frame drops on mobile after 9.5.0 (unconfirmed, no repro) [S].

## Weighted evaluation matrix

Scores 1–5 (5 best). Weights sum to 100 and reflect ARKVOID: third-person action RPG, handcrafted world, real characters, mobile reach desirable but not first.

| Dimension | Weight | Babylon.js | Three.js | PlayCanvas |
|---|---|---|---|---|
| WebGL2 compatibility | 5 | 5 | 5 | 5 |
| WebGPU maturity | 6 | 4 | 4 | 3 |
| Mobile browser support | 7 | 3 | 4 | 5 |
| Character animation | 7 | 5 | 3 | 4 |
| Environment rendering | 6 | 4 | 4 | 3 |
| PBR materials | 5 | 5 | 5 | 4 |
| Lighting architecture | 5 | 5 | 4 | 4 |
| Asset loading | 4 | 5 | 5 | 4 |
| Physics integration | 7 | 5 | 2 | 3 |
| Large-world scalability | 7 | 4 | 3 | 3 |
| Animation blending | 5 | 5 | 3 | 4 |
| Instancing | 4 | 5 | 4 | 4 |
| Developer tooling | 5 | 5 | 3 | 5 |
| Documentation quality | 4 | 5 | 4 | 4 |
| TypeScript support | 4 | 5 | 4 | 4 |
| Build size | 5 | 2 | 5 | 4 |
| Runtime overhead | 4 | 3 | 4 | 4 |
| Community maintenance | 5 | 4 | 5 | 3 |
| Commercial suitability | 5 | 5 | 5 | 4 |
| **Weighted total (/5)** | 100 | **4.39** | **3.91** | **3.86** |

Computed by script (no hand arithmetic).

### Sensitivity (does the winner survive different priorities?)
| Scenario | Babylon.js | Three.js | PlayCanvas |
|---|---|---|---|
| Base weights | 4.39 | 3.91 | 3.86 |
| Double weights of build size, mobile, community, runtime overhead | 4.15 | 4.01 | 3.90 |
| Zero weight on physics, character animation, animation blending | 4.25 | 4.21 | 3.91 |

Honest reading: Babylon's lead comes almost entirely from **built-in game systems** (physics, character animation, blending, tooling). If ARKVOID were willing to hand-build those on Three.js, the engines are close to a tie, and Three.js wins on size and community. Stage 01 already hand-built a controller, collision and streaming on Three.js, so this is a real option, not a strawman.

## Decision
**Primary engine: Babylon.js 9.x (`@babylonjs/core`), WebGL2 as the default backend, WebGPU opt-in behind a capability check and a setting.** Rationale: the matrix lead, and Havok + `PhysicsCharacterController`, animation retargeting/blending and a navmesh plugin ship in one maintained, Apache-2.0 stack, which fits the "coherent foundation, not a pile of libraries" directive. The default-candidate rule was challenged with evidence (Three.js size and ecosystem advantages; Lite's performance numbers) and the evidence does not overturn it, but it creates three **gates**:

1. **Size gate.** The first Babylon port of the Stage 01 scene must hit the Performance Constitution budget (initial JS ≤ 1.5 MB gzip excluding assets) using explicit imports and no Inspector in production. If not, reopen the Three.js option. Maintainer-reported 675 KB for a PBR scene suggests this is feasible [V], but a whole game is unmeasured.
2. **Mobile gate.** WebGPU stays off by default until measured on real Tier B/C devices (see PERFORMANCE_RESEARCH.md).
3. **Lite watch.** Re-evaluate Babylon Lite quarterly. Triggers: stated licence, WebGL fallback or WebGPU share high enough to drop WebGL2, animation and physics parity. Not adopted now: young, no backward compatibility, WebGPU-only.

PlayCanvas: strong on mobile and editor workflow, but smaller community, WebGPU still beta per docs [S], and its main authoring experience is a hosted editor, which fits a code-and-data-driven repo less well [K]. Not selected.

**Babylon Editor** is a desktop authoring tool, not a runtime. It is not adopted for the build: ARKVOID's world is generated from typed data in the repo. It may be used ad hoc for look-development. Its supported Babylon version is not stated on its page [V].

**No mixing.** One engine in the runtime. Three.js remains only until the port; see TECH_STACK_ADR.md for the migration plan.

## Sources
- Babylon.js repo: https://github.com/BabylonJS/Babylon.js — Babylon 9.0: https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0
- Large World Rendering: https://forum.babylonjs.com/t/new-large-world-rendering-experimental/61114
- Babylon Lite: https://forum.babylonjs.com/t/introducing-babylon-lite/63648 · https://forum.babylonjs.com/t/babylon-x-vs-lite-vs-9/63786 · https://forum.babylonjs.com/t/webgpu-on-mobile-is-it-ready/63694
- Mobile WebGPU report: https://forum.babylonjs.com/t/webgpu-performance-regression-and-worker-thread-lag-on-mobile-since-v9-5-0/63456
- Three.js: https://github.com/mrdoob/three.js · releases: https://github.com/mrdoob/three.js/releases
- PlayCanvas: https://github.com/playcanvas/engine · Babylon Editor: https://github.com/BabylonJS/Editor
- Cross-engine sizes/versions (secondary): https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison
