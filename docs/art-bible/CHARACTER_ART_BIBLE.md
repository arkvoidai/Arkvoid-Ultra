# ARKVOID Character Art Bible

Tags: `[V]` verified this session, `[K]` prior knowledge to confirm, `[D]` design decision. Direction: realistic human anatomy, memorable facial identities, expressive eyes, individual hair structures, detailed but functional clothing. **No character model exists yet; the Stage 01 avatar is a capsule placeholder.**

## 1. Proportion and anatomy `[D]`
- Adult height 1.50–1.90 m; reference hero 1.75 m. Head height ≈ 1/7.5 of the body. Variation by build, not by fantasy proportion.
- Realistic joint limits; shoulder, hip and spine ranges drive the rig limits.
- No pointed ears, wings or non-human skeletal features in the base cast (RJ-08; U01/U02 are not followed there). Non-human beings are creatures (CREATURE_ART_BIBLE) or later, separately approved.

## 2. Facial identity system `[D]`
Every named character has a one-page face sheet with three layers:
1. **Bone structure:** brow ridge, cheekbone width, jaw angle, nose bridge, chin, ear set.
2. **Soft tissue:** lid fold, lip volume, nasolabial depth, scars, asymmetry (every face is ≥ 3% asymmetric).
3. **Life evidence:** weathering, sun lines, callus, calligraphy-ink stains, sleep, age spots.
**Memorability test:** the character's face, reduced to a flat silhouette plus 3 feature notes, can be told apart from every other named character at 5 m in a lineup.

### Eyes
Eyes carry performance. Spec: sclera with vein variation, iris with limbal ring and radial fibres, thin wet line, tear meniscus, caruncle, correct corneal bulge for specular. Gaze system: saccades and micro-saccades plus eyelid follow (lids track vertical gaze). Budget in the Production Standards table.

## 3. Hair `[D]`
- Individual structure: each hairstyle has a defined parting, crown whorl, and strand grouping. No hair that is a single mesh blob.
- Real-time: layered hair cards (clumps) with alpha-tested/hashed edges, 3 LODs; hero hair ≤ 8,000 triangles at LOD0 (Production Standards).
- Strand groups must move with gravity, wind and head motion; ties and pins visibly hold hair (U01's chained headdress without attachment is rejected).

## 4. Costume rules (functional construction) `[D]`
1. **Layer order** from the body out: undergarment, inner robe, outer robe, belt/sash, over-garment, accessories. Sheer-over-opaque layering is allowed (RP-09) when the sheer layer has seams, hems and a clear pattern.
2. **Closures:** knotted ties, toggles, wrap overlaps; no invisible closures.
3. **Seams** and panel construction visible at LOD0; sleeve construction is a real tube, not a cone.
4. **Trailing cloth** (sashes, ribbons) attaches to a belt loop or cord, obeys gravity and wind; no floating ribbons (RJ-08).
5. **Fabric by role:** hemp or ramie (work), indigo cotton (mid-rank), silk (ceremonial), wool felt (high altitude). Each material has a weight class for cloth sim.
6. **Ornament** follows NOTCH-SPAN-RING embroidery on the weave grid; no random filigree.
7. **Armour:** lamellar, scale or plated from real construction logic; plates overlap in the direction that sheds blows or water.
8. **Practicality test:** a tailor must be able to explain how it is put on, and the animator how it moves when running, climbing and sitting.

## 5. House costume language
| House | Silhouette | Cloth | Metals | Insignia placement |
|---|---|---|---|---|
| Beam | Long straight robe, belt tool-loops | Hemp, cedar-brown | Iron fittings | Right sleeve band |
| Plumb | Heavy short robe, shoulder wrap | Wool felt, grey | Stone-weight belt | Back panel |
| Cast | Fitted robe, bronze frog closures | Indigo, charcoal | Bronze buttons, verdigris | Collar |
| Weft | Layered wrap, cord work | Indigo, madder | Bone, wood | Hem |
| Race | Light split robe, leggings | Pale ramie | Copper clasp | Sash |
Costume colour obeys the palette budget; vermilion only for rank sashes.

## 6. Animation and rig standards `[D]`
- Skeleton: ≤ 120 joints for hero (matches the existing budget), humanoid retargetable to a standard rig. Babylon 9 lists animation retargeting `[V]`.
- Facial: 52 ARKit-style blendshapes plus ≤ 12 correctives, driven via morph targets `[D]`; verified feasible count on target devices is a Stage 03 gate.
- Locomotion set (Stage 03): idle, walk, run, jump, fall, land, climb, vault, sheathe/draw. Foot IK on slopes.
- Weight and breathing: chest breathing ≥ 12 breaths/min idle, with a subtle weight shift every 4–8 s.
- Martial animation targets: believable weight transfer and root-motion cancel windows; reference real martial-art footage (licensed, or our own capture).

## 7. Cinematic hero standard
Close-up shots use a hero LOD (LOD0+), facial 4K normal map, hair LOD0, cloth sim on, and a dedicated eye shader.

## 8. What is forbidden
Winged humans, ear-points, bare-skin-only "costumes", invisible costume supports, jewellery with no attachment, floating ribbons, hair merging into cloth, and any resemblance to a named character from an existing franchise.
