# ARKVOID Production Quality Standards

Tags: `[D]` design decision, `[V]` verified. Complements `docs/constitution/ART_DIRECTION_CONSTITUTION.md` and `docs/research/ASSET_PIPELINE_RESEARCH.md`. Numbers are targets until measured on Tier A/B/C devices. `tools/assets/budgets.json` enforces the triangle/material/texture/joint columns.

## 1. Tiers
| Tier | Definition | Examples |
|---|---|---|
| **Hero** | Seen close, lingered on, cinematic | Named characters, stele hall centrepiece, a boss |
| **Major** | Large or often seen | Great gate, bridges, cliff halls, boss arenas, mid creatures |
| **Standard** | Common props and buildings | Houses, lanterns, crates, trees, rocks |
| **Distant** | Seen only far away | Far cliffs, background monasteries, skyline |

## 2. Budgets by tier `[D]`
| | Hero | Major | Standard | Distant |
|---|---|---|---|---|
| Triangles LOD0 (character) | ≤ 60,000 | ≤ 45,000 | ≤ 25,000 | n/a |
| Triangles LOD0 (environment piece) | ≤ 30,000 | ≤ 15,000 | ≤ 8,000 | ≤ 2,000 |
| LOD chain | LOD0–LOD3 | LOD0–LOD2 | LOD0–LOD2 | 1 LOD + impostor |
| LOD ratios (triangles) | 1 / 0.35 / 0.12 / 0.04 | 1 / 0.4 / 0.15 | 1 / 0.4 / 0.15 | 1 |
| Materials per asset | ≤ 6 | ≤ 4 | ≤ 2 | 1 |
| Texture size | 4K (face) / 2K (body) | 2K | 1–2K | 512–1K |
| Texel density | 512 px/m | 256–512 px/m | 256 px/m | 64–128 px/m |
| Joints | ≤ 120 | ≤ 90 | ≤ 60 | 0 |
Budgets are also enforced for the whole scene by the Performance Constitution (≤ 300 draw calls, ≤ 1.5 M triangles in view).

## 3. Geometry and retopology
- Quad-dominant topology on deforming meshes; edge loops follow muscle flow around eyes, mouth, shoulders, elbows, knees.
- Hero face: ≥ 3 edge loops around each eye and the mouth; no triangles on deformation areas.
- Static environment: triangulated and optimised by the pipeline (meshopt) after export.
- Hard-surface bevels: LOD0 gets real bevels on edges visible within 5 m; others use normal-map bevels.
- Non-manifold geometry, flipped normals, zero-area faces: rejected at validation.

## 4. UVs and texturing
- UV islands with ≥ 4 px padding at the target mip chain; consistent texel density (± 15% within an asset).
- Shared trim sheets and tiling materials for architecture; unique texture sets only for hero assets.
- Mirror UVs allowed on symmetric environment pieces; never on faces.
- Normal maps baked from a high-poly source or authored from scanned detail; tangent space MikkTSpace.
- No baked lighting; AO is a separate channel in ORM.

## 5. Material consistency
- All materials from MATERIAL_LIBRARY IDs; a new material needs an entry there.
- baseColor values within the PBR ranges stated; roughness floors enforced (no mirror floors).
- Colour check against the palette budget in VISUAL_IDENTITY on a neutral light.

## 6. Characters
| Item | Standard |
|---|---|
| Skeleton | Humanoid, ≤ 120 joints, shared retarget rig |
| Facial | 52 blendshapes + ≤ 12 correctives (hero); 20 for standard NPCs |
| Hair | Cards, LOD3; hero ≤ 8,000 triangles LOD0 |
| Cloth | Hero: simulated or secondary bones for loose layers; others: bone-driven secondary motion |
| Skin | 4K face, 2K body, SSS on hero |
| Eyes | Dedicated shader with a corneal bulge, wet line, tear meniscus |
| Animation | Locomotion set per Stage 03; 30 fps keys with resampling, compressed by the pipeline |

## 7. LOD and engine compatibility
- LOD switch by screen-space size; a crossfade or dithered transition of 0.25 s.
- All assets are glTF 2.0 `.glb`, meshopt-compressed, KTX2 textures (pipeline gate), loadable by Babylon.js 9.x loaders per `TECH_STACK_ADR.md`.
- Instancing: repeated props are exported as separate meshes with shared materials so thin instances can be used.
- No custom shaders in asset files; shaders live in engine code.

## 8. Validation gate (every asset)
1. Exported to `assets/source/<class>/`.
2. `npm run assets:process` then `npm run assets:validate`: validator 0 errors/warnings, tier budgets, provenance row (see ASSET_PIPELINE_RESEARCH.md; scripts not yet executed against a real GLB).
3. Visual review in-engine under three lighting states.
4. Art-direction sign-off using the One-Universe Test in VISUAL_IDENTITY.
5. Ledger entry.

## 9. Asset acquisition rules
1. Only Category B, C or E assets ship (REFERENCE_REGISTER).
2. Poly Haven and ambientCG assets are CC0 on their licence statements `[V]`; record each asset anyway.
3. A repository's licence does not cover every file inside it (BabylonJS/Assets, Khronos samples): verify each asset.
4. Do not import Mixamo or any asset of unclear terms.
5. In-house generated assets (including AI) need tool, prompt summary, date and an originality review before any use as production source.
6. Scans of heritage sites require written permission; none are used now.
