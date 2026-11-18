# ARKVOID Licence Register

Date: 2026-11-18. This is an engineering record, not legal advice. Status: `VERIFIED` = licence read on the project's primary page this session; `UNVERIFIED` = not confirmed; must be confirmed before adoption. "Release considered" is where the page showed one; otherwise confirm at install.

| Component | Upstream | Licence | Status | Release / commit considered | Maintenance signals | Used how | Notices to preserve |
|---|---|---|---|---|---|---|---|
| Babylon.js (`@babylonjs/core`, loaders) | github.com/BabylonJS/Babylon.js | Apache-2.0 | VERIFIED (repo sidebar) | 9.0 (2026-03-26); core 9.27.1 reported Sept 2026 | 47,922 commits, active | npm dependency (planned, Stage 02) | LICENSE + NOTICE (if any) from package; list in THIRD_PARTY_NOTICES |
| Havok for web (`@babylonjs/havok`) | npm / Babylon docs | "MIT" per Babylon docs mirror and a forum answer | **UNVERIFIED at package level** | not shown | n/a | npm dependency (when dynamic physics lands) | Read package LICENSE after install; record verbatim |
| Babylon Editor | github.com/BabylonJS/Editor | Apache-2.0 | VERIFIED | v5.5.0 | 3,492 commits | Optional tool, not in build | none |
| Babylon Lite | github.com/BabylonJS/Babylon-Lite | not stated on the page read | UNVERIFIED | 1.27.0 / 1.33.0 mentioned [S] | young | Not adopted | n/a |
| BabylonJS/Assets | github.com/BabylonJS/Assets | CC-BY-4.0 default, per-folder overrides | VERIFIED (README) with a contradictory repo description ("public domain") | n/a | n/a | Not imported; any use requires per-asset check | Attribution required if used |
| Three.js | github.com/mrdoob/three.js | MIT | VERIFIED | r186 | 48,427 commits | Currently in Stage 01 (`three`), removed at port | MIT notice |
| PlayCanvas engine | github.com/playcanvas/engine | MIT | VERIFIED | 2.22.x [S] | 14,035 commits | Not adopted | n/a |
| Rapier | github.com/dimforge/rapier | Apache-2.0 | VERIFIED | core 0.35.3 (2026-08-28); JS bindings version unconfirmed | 1,389 commits | Not adopted now | n/a |
| navcat | github.com/isaac-mason/navcat | MIT | VERIFIED (sidebar link; not legal text) | not shown | 620 commits, 4 open issues | Candidate, Stage 05/06 | MIT notice; check its dependencies then |
| recast-navigation-js | github.com/isaac-mason/recast-navigation-js | not read | UNVERIFIED | 0.43.1 seen in search [S] | n/a | Reference only | n/a |
| RecastNavigation | github.com/recastnavigation/recastnavigation | zlib | VERIFIED (README) | none shown | 1,184 commits | Algorithm reference only; no code copied | n/a |
| glTF Transform | github.com/donmccurdy/glTF-Transform | MIT | VERIFIED | CLI 4.2.0 (cached npm page) | 2,131 commits | devDependency (tools) | MIT notice (dev-only; not shipped) |
| meshoptimizer | github.com/zeux/meshoptimizer | MIT | VERIFIED (`LICENSE.md`) | tag v1.2 referenced | active | Runtime decoder (`meshoptimizer` npm) if meshopt-compressed assets ship | MIT notice (shipped: required) |
| glTF Validator | github.com/KhronosGroup/glTF-Validator | Apache-2.0 | VERIFIED (LICENSE + NOTICES files exist) | not shown | 310 commits | devDependency (tools) | Apache-2.0 + NOTICES (dev-only) |
| glTF Sample Assets | github.com/KhronosGroup/glTF-Sample-Assets | per-model (mixed; CC-BY-4.0 example) | VERIFIED as mixed | n/a | 600 commits | Local pipeline tests only, not shipped | per-model README |
| glTF spec | github.com/KhronosGroup/glTF | not read | UNVERIFIED | n/a | n/a | Reference | n/a |
| Blender | github.com/blender/blender | GPL-3.0 (application) | VERIFIED for the app | n/a | official mirror | Authoring tool only. Not shipped or linked. Status of output files and glTF exporter licence not confirmed | n/a |
| CesiumJS | github.com/CesiumGS/cesium | Apache-2.0 | VERIFIED | not shown | ~47,000 commits | Not adopted | n/a |
| Poly Haven assets | polyhaven.com/license | CC0 ("effectively public domain"), commercial use and redistribution allowed, no attribution required | VERIFIED | per asset | n/a | Candidate textures/HDRI (see ASSET_PROVENANCE) | None required; we record anyway. Site logos, example renders, UI text are **not** CC0. Scraping/data-mining the site needs permission; API has separate terms |
| ambientCG assets | ambientcg.com | CC0 statement on homepage ("free to use without attribution", commercial allowed) | PARTIAL (homepage only; `/license` page blocked) | per asset | n/a | Candidate, none selected | None required; confirm the licence page before first import |

## Rules in force
1. No whole repository is copied into ARKVOID. Dependencies come from npm packages.
2. Code from a dependency is not extracted unless its licence permits and the notice is preserved in THIRD_PARTY_NOTICES.md with file, source commit and modification.
3. Copyleft (GPL/AGPL/LGPL) code is not linked into the shipped bundle. Blender is a tool only.
4. UNVERIFIED rows must be re-checked, and the licence text saved verbatim in THIRD_PARTY_NOTICES.md, before the dependency lands in `package.json` or its assets in `public/`.
5. Re-verify this register at each stage start; versions and licences change.
