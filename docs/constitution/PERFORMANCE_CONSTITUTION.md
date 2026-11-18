# ARKVOID Performance Constitution

## Frame budgets

The budgets below are initial engineering targets, not measured claims.

| Target class | Frame target | CPU game/update target | GPU/render target |
| --- | ---: | ---: | ---: |
| Mid/high desktop | 60 FPS | 4 ms average | 12 ms average |
| Entry desktop / laptop | 45 FPS | 6 ms average | 16 ms average |
| Supported mobile baseline | 30 FPS | 8 ms average | 24 ms average |

Measure p50 and p95 frame time during representative traversal and combat. Averages alone can hide stutter.

## Initial prototype constraints

- Cap renderer pixel ratio rather than blindly matching high-DPI device pixels.
- Use instancing for repeated vegetation and rock geometry.
- Keep shadow map size and shadow-casting lights bounded.
- Avoid allocating vectors, arrays or closures in the hot frame path when practical.
- Clamp simulation delta after focus loss.
- Keep the supported world bound explicit.
- Add profiling overlays only when they report measured values.

## Production budgets to establish

The next profiling pass must establish real baselines for:
- Draw calls, triangles and visible object count.
- Geometry and texture memory.
- Shader compile and first-frame time.
- CPU update time and GPU frame time.
- Long-frame distribution and thermal throttling on mobile.
- Initial and steady-state memory during extended sessions.

## Scaling strategy

Introduce frustum and distance culling before increasing density. Add level-of-detail and hierarchical world cells before expanding the playable radius. Separate simulation relevance from render visibility. Stream and unload world cells only after ownership, lifecycle and save boundaries are designed.

## Acceptance

A performance claim must state hardware, browser, resolution, quality settings, scene, duration, sample count and p50/p95 results. Do not claim “60 FPS on mobile” without device evidence.
