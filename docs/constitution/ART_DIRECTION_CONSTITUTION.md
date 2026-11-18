# ARKVOID Art Direction Constitution

## Identity

ARKVOID should feel like a place with age, geography, culture and consequence. The first world is a cultivation-inspired mountain civilisation, but the visual identity must be original and extend beyond any one fictional reference.

The target is premium, grounded fantasy—not generic neon science fiction, toy-like low-poly presentation or an anime reskin.

## Visual pillars

1. **Geographical scale:** layered mountain silhouettes, readable valleys, passes, waterways and settlements.
2. **Architectural authorship:** coherent construction logic, material traditions, hierarchy and weathering.
3. **Human believability:** anatomy, silhouette, facial performance, posture, cloth construction and animation must be considered together.
4. **Material credibility:** PBR response, roughness variation, edge wear, stone grain, timber, metal, fabric and skin.
5. **Atmospheric depth:** controlled fog, exposure, cloud cover, time-of-day lighting and distance readability.
6. **Environmental narrative:** wear paths, abandoned structures, tools, offerings, damage and lived-in spaces communicate history.
7. **Distinctive forms:** sects, creatures, weapons, architecture and costume language must be recognisably ARKVOID.

## Production pipeline

- Blockout: validate scale, traversal, sightlines and encounter composition.
- Modelling: maintain reference scale, topology standards, clean pivots and named material slots.
- UV and materials: texel-density targets, channel packing, trim sheets and shared material families.
- Rigging and animation: consistent skeleton conventions, locomotion sets, combat states and retargeting rules.
- Engine integration: LODs, collision meshes, lightmap/texture budgets where relevant, bounds and origin conventions.
- Review: compare in-engine under representative lighting, not only a DCC viewport.

## Asset policy

The current world and character are procedural geometry blockouts. They establish scale and runtime behaviour only. Replace them through a documented asset pipeline; do not disguise the blockout as final art.

Every acquired asset needs a provenance entry in `docs/assets/ASSET_REGISTER.md`. No extracted commercial game content, ripped models, copied concept art or unauthorised textures.

## Visual quality review

Review a scene from gameplay camera distance, at native target resolution and on representative hardware. Evaluate silhouette, value grouping, scale, readability, composition and material response before adding expensive effects.

More polygons, more bloom and more particles do not automatically mean higher quality.
