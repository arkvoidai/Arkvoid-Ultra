# ARKVOID Repository Review

Date: 2026-11-18. Legend: `[V]` read from the primary page this session, `[S]` secondary source, `[K]` prior knowledge unverified.

## Depth of inspection (read this first)
I read repository front pages, READMEs, root manifests, release/changelog pages and official documentation. I did **not** read engine class implementations or unit tests, and several GitHub sub-pages were refused by the fetch tool (releases pages, deep docs, the Rapier `typescript` folder). Where a source path is named it came from a README or manifest I saw. "Release considered" says "not shown" where GitHub's page did not render a release; versions then come from secondary sources and must be pinned at install time with `npm view <pkg> version`.

## Per-repository review

### BabylonJS/Babylon.js — ADOPT (primary engine)
- Upstream: github.com/BabylonJS/Babylon.js, default branch `master` [V]. Licence Apache-2.0 [V]. 26.3k stars, 47,922 commits, 13 open issues, 32 open PRs [V].
- Release considered: 9.0 (2026-03-26) [V]; `@babylonjs/core` 9.27.1 reported Sept 2026 [S].
- Manifest [V] (`package.json`, root): private monorepo `@babylonjs/root` v1.0.0, workspaces `packages/**/*`, Node `^20.19.0 || >=22.13.0 <23 || >=24`, npm `>=11.18.0`, devDeps TypeScript ~6.0.2, vite 8.2.2, vitest ^4.1.11, eslint ^10, and `@babylonjs/lite` 1.27.0. No `license` field in the root manifest (it is a private workspace root; the licence is in the repo's LICENSE and sidebar). Per-package `package.json` files (under `packages/`) were not inspected.
- Principal APIs to use (from docs/blog): `Engine`/`WebGPUEngine`, `Scene`, `PBRMaterial`, `ShadowGenerator`/cascaded shadows, `HavokPlugin`, `PhysicsAggregate`, `PhysicsCharacterController` [K], glTF loader, thin instances, Frame Graph, animation retargeting, `useLargeWorldRendering` option [V].
- Integration failure modes: bundle bloat from non-explicit imports; side-effect imports required for some helpers; Inspector left in prod [S]; experimental Large World Rendering gaps [V].
- Package choice: `@babylonjs/core` (+ `@babylonjs/loaders`) via ES modules, **not** the legacy `babylonjs` UMD package [K/S: the article lists the legacy package separately].

### BabylonJS/Editor — NOT ADOPTED for build (optional look-dev tool)
Apache-2.0, desktop app, v5.5.0 listed, 1.1k stars, 3,492 commits [V]. Supported Babylon version not stated. Reason: ARKVOID world is data/code-driven.

### BabylonJS/Babylon-Lite — WATCH
WebGPU-only renderer [V, forum announcement]. Repo page could not be fetched; licence unverified. See ENGINE_COMPARISON.md.

### mrdoob/three.js — FALLBACK (current Stage 01 renderer)
MIT [V], 117.2k stars, default branch `dev`, r186 (24 Sep) with WebGPU/TSL/WebGL notes [V]. Retained only until the Babylon port; reopened only if the size gate fails.

### playcanvas/engine — NOT ADOPTED
MIT [V], 17.2k stars, 14,035 commits, 431 issues [V]. v2.22–2.23 era [S]. See ENGINE_COMPARISON.md.

### dimforge/rapier — NOT ADOPTED NOW (engine-independent alternative)
Apache-2.0 [V], 6k stars, 1,389 commits, Rust core v0.35.3 (2026-08-28) [V]. JS bindings at `bindings/typescript/` [V]; JS package version unconfirmed. Character controller API documented at rapier.rs [V] (see PHYSICS_EVALUATION.md).

### isaac-mason/navcat — CANDIDATE for Stage 05/06
MIT [V], 305 stars, 620 commits, 4 open issues, CHANGELOG.md present, CI present [V]. Entry points `navcat`, `navcat/blocks`, `navcat/three` [V]. Latest release and runtime dependencies not visible on the page.

### isaac-mason/recast-navigation-js — REFERENCE ONLY
Fetch refused; known only through Babylon's Navigation Plugin V2 announcement [S].

### recastnavigation/recastnavigation — REFERENCE (algorithms), not a dependency
zlib [V], 8.0k stars, 1,184 commits, 109 open issues, components Recast/Detour/DetourCrowd/DetourTileCache [V]. No release shown.

### donmccurdy/glTF-Transform — ADOPT (dev tooling)
MIT [V], ~2k stars, 2,131 commits, packages core/extensions/functions/cli [V]. CLI 4.2.0 on a cached npm page [S/V].

### zeux/meshoptimizer — ADOPT (via glTF Transform; JS decoder for runtime)
MIT [V] (`LICENSE.md`), references tag v1.2 [V], npm `meshoptimizer` and `gltfpack` [V].

### KhronosGroup/glTF-Validator — ADOPT (dev tooling)
Apache-2.0 [V], 471 stars, 310 commits, includes NOTICES file [V]. Dart-built; npm package `gltf-validator`.

### KhronosGroup/glTF-Sample-Assets — TEST CORPUS ONLY
Mixed per-model licences; `Models/`, `LICENSES/`, `REUSE.toml` in repo [V]. See ASSET_PIPELINE_RESEARCH.md.

### KhronosGroup/glTF (spec) — REFERENCE
Not reviewed this session.

### blender/blender — TOOL (not shipped)
GPL-3.0 application; "official mirror" of projects.blender.org [V]. Exporter location/licence unconfirmed.

### BabylonJS/Assets — LIMITED USE, per-folder check
README: CC-BY-4.0 "unless specified otherwise in the asset folder"; repo description says "public domain" (a contradiction the page does not resolve). The `mixamo` folder shows no licence on the page [V]. **Do not import Mixamo content**: its terms are outside this repo's licence statement and unverified; avoid.

### CesiumGS/cesium — NOT ADOPTED
Apache-2.0 [V], 16k stars, ~47,000 commits. Concepts reviewed below.

#### What ARKVOID can learn from CesiumJS without using it
- **Screen-space-error driven LOD** and **tile hierarchy** (3D Tiles): ARKVOID's chunk ring could become a quadtree of chunks with hierarchical LOD (far chunks use coarser meshes). Implement independently (concept, not code).
- **Streaming with a budgeted request/load queue and cache eviction**: already mirrored by `ChunkManager` (load budget per update, unload radius).
- **High-precision positions / RTC-relative rendering**: relevant only if the world exceeds float precision; Babylon's own floating origin covers this (experimental).
- **WGS84 globe, imagery layers, Cesium ion**: irrelevant to a handcrafted fantasy world; adds a large dependency and an open-core commercial service [V]. Babylon maintainers themselves recommend pairing with Cesium for geospatial work, not for games [V].

## Other projects
No additional project is added: nothing in the research found a concrete problem that the selected stack leaves unsolved.
