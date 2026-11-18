# ARKVOID Performance Research

Date: 2026-11-18. Legend: `[V]` primary source read this session, `[S]` secondary, `[K]` prior knowledge to verify, `[M]` measured here.

**No real-device or browser measurements exist yet.** This sandbox has no browser, GPU or ability to install the engine. Everything below is either a documented technique with its evidence level, a measured Node micro-benchmark, or a measurement protocol with pass/fail gates.

## Measured so far [M]
Node 22, Xeon 2.1 GHz x2 VM, simulation only:
- Player step: 373 ns. Heightfield sampling per terrain chunk: 0.675 ms (lower bound of chunk build).
- Resident terrain chunks at view radius 3: 29 (cap in constitution: 40).

## Techniques available in the selected engine (Babylon.js 9.x)

| Technique | Status | Use in ARKVOID | Evidence |
|---|---|---|---|
| Explicit ES imports + proxy module, no Inspector/debug layer in prod, no sourcemaps in shipped bundle | Stable | Mandatory; size gate in ADR | Forum thread: tree-shaking needs explicit imports; side-effect imports needed for some helpers; one project measured ~2.5 MB dist / ~500 KB gzip [S] |
| Thin instances | Stable | Vegetation, rocks, repeated architecture | In Babylon feature list; forum notes thin instances with all-zero matrices produce NaN bounds in navmesh generation [V/S] |
| Clustered lighting | New in 9.0 (WebGL2 + WebGPU) | Many local lights (torches, lanterns, qi effects) | [V] |
| Frame Graph v1 | New in 9.0 | Render pipeline control; cited ≥40% GPU memory saving in some cases | [V] maintainers' claim |
| WebGPU snapshot rendering | Stable on WebGPU | Cut CPU cost for mostly static scenes | Babylon docs via secondary article [S] |
| Large World Rendering (`useLargeWorldRendering`, floating origin) | **Experimental** in 9.0 | Only if a single continuous coordinate space exceeds float precision (~10 km from origin) | [V]; shadows initially unsupported then patched; billboards/infinite-distance not yet; one MixMaterial-terrain issue on WebGPU unconfirmed fixed |
| LOD + Scene Optimizer | Stable | Characters/props LOD; automatic degradation on low tiers | [K], verify |
| Volumetric lighting | New, WebGPU compute with WebGL2 fallback | Optional "Tier A" feature only | [V] |

## Mobile and WebGPU position
- Default backend **WebGL2**. WebGPU is opt-in and gated by measurement.
- Reports on Babylon WebGPU mobile are mixed: one tester found an older Pixel 5 faster on WebGL2; iOS good; one May 2026 "device lost" report on 9.5.0 without repro [S].
- Babylon Lite claims large speed/size wins but is WebGPU-only [V]. Not adopted.

## Budgets (from PERFORMANCE_CONSTITUTION.md, unchanged)
60 fps Tier A, 30 fps Tier B, 30 fps Tier C (post-Stage 03); ≤300 draw calls; ≤1.5M triangles in view; chunk build ≤4 ms; initial JS ≤1.5 MB gzip; HUD ≤4 Hz DOM updates.

## Measurement protocol (to run at Stage 02)
1. **Fixed benchmark route**: scripted camera/player path through plaza, courtyard and terrain edge, 90 s, same seed.
2. **Devices** (record model, OS, browser, version): Tier A desktop (GTX 1660 / RX 580 class), Tier B (Iris Xe / Apple M1 class), Tier C (recent mid-range phone).
3. **Metrics** per run: avg fps, 1% low fps, p95 frame ms, JS main-thread ms, draw calls, triangles, GPU memory estimate, JS heap, initial transfer size (gzip), time to interactive, chunk build ms (p95).
4. **A/B**: WebGL2 vs WebGPU; KTX2 vs WebP textures; with/without shadows; each at 3 runs, report median.
5. **Gates**: any budget miss > 10% blocks merge unless justified in the ledger.
6. Harness: add an in-engine `?bench=1` mode that logs the metrics as JSON; run in CI with a headless browser only for regression of CPU-side numbers (GPU numbers need real devices).

## Open risks
- Babylon bundle size vs. our budget (size gate).
- WebGPU mobile stability.
- Experimental status of Large World Rendering. Prefer a world that fits within precision limits (chunk-local coordinates) until it stabilises.
- Havok WASM load time and size (unmeasured).

## Sources
- https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0
- https://forum.babylonjs.com/t/babylon-bundle-size/48068
- https://forum.babylonjs.com/t/new-large-world-rendering-experimental/61114
- https://forum.babylonjs.com/t/webgpu-on-mobile-is-it-ready/63694
- https://forum.babylonjs.com/t/webgpu-performance-regression-and-worker-thread-lag-on-mobile-since-v9-5-0/63456
