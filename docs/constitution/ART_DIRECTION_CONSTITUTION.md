# ARKVOID Art Direction Constitution

> Superseded in detail by `docs/art-bible/` (Stage 03). Where the two differ, the art bible wins; the budgets below remain the constitutional minimums.

## Intent
An original cultivation-fantasy identity: monumental mountain geography, ancient stone-and-timber sect architecture, atmospheric depth, restrained high-contrast lighting, distinctive character silhouettes. Inspiration is broad genre tradition; no copying of any specific game, film, or illustration.

## Principles
1. Silhouette first. Characters and landmarks must read as flat black shapes at 100 m.
2. Scale hierarchy. Every vista has foreground, midground, and a monumental background landmark.
3. Atmosphere is structure. Fog, light shafts and colour temperature separate depth layers.
4. Material honesty. PBR (albedo, normal, roughness/metal, AO). No baked lighting in albedo.
5. Palette discipline. Each region defines a palette (5 key colours + 2 accents) recorded here before production.
6. Quality through coordination, not polycount.

## Current state (Stage 01)
Procedural vertex-coloured terrain, box-primitive courtyard, capsule avatar. **All of this is placeholder blockout.** No final art exists. Do not describe it as final.

## Production standards (apply when real assets arrive)
- Format: glTF 2.0 / GLB, Draco or Meshopt compression, KTX2 textures.
- Texel density: 512 px/m for hero props, 256 px/m for environment kits.
- Character budget (hero, LOD0): ≤ 60k triangles, ≤ 120 bones; LOD1 ≤ 20k; LOD2 ≤ 6k.
- Environment kit piece LOD0 ≤ 8k triangles.
- Every asset has a provenance record (see IP policy) before merge.
