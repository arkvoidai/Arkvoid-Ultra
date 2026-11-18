# ARKVOID Performance Constitution

All numbers are **targets**. Nothing here has been measured on real hardware yet; measured results go in `PROGRESS_LEDGER.md` with device, browser, date.

## Reference tiers
| Tier | Device class | Resolution | Target |
|---|---|---|---|
| A | Desktop, GTX 1660 / RX 580 class | 1920×1080 | 60 fps, 1% low ≥ 45 |
| B | Integrated (Iris Xe / Apple M1 class) | 1920×1080 | 30 fps minimum, 60 stretch |
| C | Recent mid-range phone | 1280×720 equivalent | 30 fps (post-Stage 03) |

## Budgets (Tier A)
- Frame time: ≤ 16.6 ms total; JS main-thread ≤ 8 ms.
- Draw calls ≤ 300; triangles in view ≤ 1,500,000.
- Fixed simulation step: 1/60 s; max 5 catch-up steps per frame.
- Chunk build ≤ 4 ms per chunk; ≤ 1 chunk built per frame during normal play.
- Resident terrain chunks ≤ 40 (current config: view radius 3 → ≤ 29).
- GC: no per-frame allocations in the simulation hot path (reuse vectors).
- Initial JS ≤ 1.5 MB gzip excluding assets. Time to interactive ≤ 6 s on 50 Mbps.
- HUD DOM updates ≤ 4 Hz.

## Measurement
Debug HUD shows fps, frame ms, draw calls, triangles, resident chunks. Record real-device numbers per milestone. A regression > 10% on any budget blocks merge unless justified in the ledger.
