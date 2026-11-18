# ARKVOID Material Library

Tags: `[V]` verified this session, `[K]` prior knowledge to confirm against a PBR reference when authoring, `[D]` design decision. **Status of every row: not acquired. No material has been imported.** Candidates come from Poly Haven (CC0 on its licence page `[V]`) and ambientCG (CC0 on its homepage `[V]`); asset pages must be re-read before download (`assets/ASSET_PROVENANCE.md`).

## 1. PBR rules `[D]`
- Workflow: metallic/roughness, glTF 2.0 compatible. Maps: baseColor, normal, occlusion/roughness/metallic packed (ORM), optional emissive, optional height for parallax on hero surfaces only.
- No baked lighting or AO in baseColor.
- Dielectric baseColor sRGB values roughly in 30–240 `[K]` (below 30 is too dark, above 240 too bright); metal baseColor from measured F0 values `[K]`.
- **Roughness floors:** no surface below 0.35 roughness except still water, glazed tile and polished bronze with stated wear; floors in public halls ≥ 0.45 (RJ-05).
- Texel density: hero 512 px/m, environment 256 px/m, background 128 px/m (matches the Art Direction constitution).
- Texture format: KTX2 (UASTC for normals, ETC1S for colour) after the pipeline gate; WebP only as an interim.

## 2. Material table
| ID | Material | Key traits | Roughness | Metal | Candidate source | Status |
|---|---|---|---|---|---|---|
| M-ST-01 | Weathered limestone | Pitted, solution grooves, pale grey, lichen | 0.75–0.95 | 0 | Poly Haven / ambientCG | not acquired |
| M-ST-02 | Quartz sandstone, banded | Horizontal bedding, vertical joints, buff-grey | 0.8–0.95 | 0 | same | not acquired |
| M-ST-03 | Alpine granite | Coarse grain, frost-shattered, snow in cracks | 0.7–0.9 | 0 | same | not acquired |
| M-ST-04 | Carved stone | Chisel marks, notch ornament, edge wear | 0.55–0.8 | 0 | same | not acquired |
| M-ST-05 | Red-bed sandstone | Ferric banding, dry crust | 0.8–0.95 | 0 | same | not acquired |
| M-WD-01 | Aged cedar | Grain, checking, grey weathering, water stain at eaves | 0.6–0.85 | 0 | same | not acquired |
| M-WD-02 | Lacquered timber | Vermilion or black lacquer, craquelure, chips | 0.3–0.55 | 0 | same | not acquired |
| M-BR-01 | Oxidised bronze | Verdigris, brown patina, polished high spots | 0.4–0.8 | 0.7–1.0 (patina pixels 0) | same | not acquired |
| M-IR-01 | Wrought iron | Forge scale, rust bloom | 0.5–0.9 | 0.6–1.0 | same | not acquired |
| M-FB-01 | Hemp/ramie | Coarse weave, slub | 0.9–1.0 | 0 | same / in-house | not acquired |
| M-FB-02 | Silk | Anisotropic sheen, drape | 0.3–0.6 | 0 | in-house | not acquired |
| M-FB-03 | Indigo cotton | Dye fade at folds, white warp showing | 0.85–1.0 | 0 | in-house | not acquired |
| M-FB-04 | Wool felt | Dense, fuzzy | 0.95–1.0 | 0 | in-house | not acquired |
| M-SK-01 | Human skin | Subsurface, pores, variation per ethnicity | 0.35–0.6 | 0 | in-house (scan or sculpt) | not started |
| M-HR-01 | Hair cards | Anisotropic, alpha-hash edge | 0.35–0.65 | 0 | in-house | not started |
| M-VG-01 | Leaves | Translucency, vein normal, two-sided | 0.5–0.7 | 0 | Poly Haven / in-house | not acquired |
| M-WT-01 | Water (river/lake) | IOR 1.33 `[K]`, depth absorption, foam on obstructions, flow map | 0.02–0.1 | 0 | custom shader | not started |
| M-GR-01 | Ground cover | Soil, gravel, leaf litter, moss | 0.85–1.0 | 0 | Poly Haven / ambientCG | not acquired |
| M-SN-01 | Snow | Subsurface, sparkle | 0.4–0.7 | 0 | custom | not started |

## 3. Wear and detail layer `[D]`
Wear is a *separate layer* (decals plus vertex-painted masks): moss/lichen on north faces, water streaks under eaves and parapets, chips at corners, soot above lamps, rust under iron fixings. Wear direction must obey gravity and water flow. Tarnished gold-bronze accent area ≤ 2% (VISUAL_IDENTITY).

## 4. Candidate review procedure
1. Open the asset page, record name, creator, licence, resolutions, date (as in `assets/ASSET_PROVENANCE.md`).
2. Check resolution and tiling; reject if the texture has baked light or visible repetition at 256 px/m.
3. Re-encode (KTX2), pass `npm run assets:validate`, add to the provenance table.
4. Review in-engine under three lighting states (dawn, afternoon, overcast) before approval.

## 5. Water spec `[D]`
- Depth-based absorption colour (clear alpine: cyan-green at 3 m; river: brown-green).
- Flow direction from the hydrology spline; foam only at obstacles and falls.
- Sunken structures visible to depth ≤ 6 m in clear lakes (RP-05).
- Shore wetness band 0.3 m.
