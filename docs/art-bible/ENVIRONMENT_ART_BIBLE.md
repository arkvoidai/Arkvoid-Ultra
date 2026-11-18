# ARKVOID Environment Art Bible

Tags: `[V]` verified from a source read this session, `[K]` prior knowledge to confirm, `[D]` design decision. Rule: **declare rock family, climate zone and water source before any environment art is made.**

## 1. Geology families (declare one per area) 
| ID | Family | Form language | Basis |
|---|---|---|---|
| G1 | **Joint-pillar sandstone** | Vertical walls following joint grids, horizontal bedding bands, forested tops, narrow gorges | Zhangjiajie: quartz-rich sandstone, ~500 m thick layer, joints widened by rain, frost, roots; walls vertical because erosion follows joints `[V, secondary]` |
| G2 | **Tower limestone** | Rounded cones and towers, dissolution pockets, caves, scalloped surfaces | Limestone karst is shaped by slightly acidic rain dissolving rock; different from G1 `[V, same source]` |
| G3 | **High-alpine granite/gneiss** | Glaciated horns, moraine, scree, snow line | Himalayan gorge setting `[V]` for context; rock detail `[K]` |
| G4 | **Red-bed sandstone** | Banded red cliffs, ferric weathering, dry slopes | `[K]`; replaces the "lava region" shorthand seen in U08 |
| G5 | **Gorge floor alluvium** | Rounded boulders, gravel bars, silt terraces | `[K]` |
Never mix families on one rock face without a geological contact line (an unconformity or fault).

## 2. Climate zones by altitude (design bands) `[D]`, vegetation pattern `[V]`
The Yarlung Tsangpo canyon shows the full range in one gorge: tropical lowland forest, tropical montane and subtropical broadleaf, subalpine temperate conifer, subalpine cool conifer, alpine shrub and tundra; average depth ≈2,268 m, deepest ≈6,009 m `[V]`.
| Zone | Local altitude (above gorge floor) | Vegetation | Palette cue | Mist behaviour |
|---|---|---|---|---|
| Z0 Floor | 0–600 m | Dense broadleaf, bamboo, ferns, rice terraces | Deep green, wet dark rock | Persistent morning mist, burns off by mid-morning |
| Z1 Montane | 600–1,800 m | Mixed broadleaf, camellia, oak, maples (vermilion accent) | Green-russet | Valley mist at dawn |
| Z2 Subalpine | 1,800–3,000 m | Conifer (fir, spruce, twisted pine), rhododendron shrub | Blue-green, grey | Cloud banks |
| Z3 Alpine | 3,000–4,200 m | Dwarf shrub, cushion plants, grass, scree | Buff, olive | Dry, long sightlines |
| Z4 Nival | > 4,200 m | Snow, ice, lichen on rock | Cold white-blue | Snow spindrift only |
Altitude boundaries are design numbers, not measurements. Each zone must have: 3 dominant tree/shrub types, 5 ground-cover types, 3 rock-surface lichens or mosses, and a defined fauna set.

## 3. Hydrology: no water without a source `[D]`
Every water feature has a record: catchment area → channel → feature → sink.
- **Waterfall:** needs a catchment above, a channel feeding the lip, a plunge pool, and a mist rule (mist only within ~3× fall height downwind). Cap: ≤ 3 visible falls per vista except in the designated waterfall region.
- **River:** a continuous spline from source to sink; width and flow grow downstream; no river flows uphill relative to the terrain heightfield (validated in the world build step).
- **Built water:** leats (contour channels), aqueduct troughs on arches, cisterns, check dams, mill-races, terrace drains with weep holes. These belong to the Race house.
- **Lakes:** fed and drained; shorelines follow contours.

## 4. Settlement logic `[D]` (from U04 and U07 principles)
- Farm terraces on gentle slopes in Z0–Z1, following contour lines.
- Towns on the slope shoulder above flood level, near a tributary, with a road ascending diagonally.
- High shrines and watchtowers on spurs and saddles (visibility, not just beauty).
- Cliff structures follow ARCHITECTURE §Cliff construction.
- **Layered history:** every region includes at least one older structure that is buried, flooded or overgrown (e.g. a ring-shaped sunken cistern), because U09's strongest idea is time depth.

## 5. Composition rules for hand-built vistas `[D]`
1. **Three planes:** a textured dark foreground frame (rock, tree, eave), a lit mid-ground subject, a value-stepped distance (RP-01, RP-13).
2. **One accent hue** per vista (vermilion maple or banner).
3. **One Tier-S landmark** visible from the region's gateway.
4. **Light direction** declared per vista; shadows must agree.
5. **Scale device:** a human, boat, bridge or terrace within the frame.
6. **Distant mountains** are non-playable meshes with silhouettes authored for readability (ridgelines that overlap at least twice).

## 6. Landmark tiers and spacing
| Tier | Visible from | Examples |
|---|---|---|
| S | ≥ 5 km | A dominant peak, the Cleave wall, a huge Void ring seen from the rim |
| A | 1–5 km | A cliff monastery, a viaduct, a great gate |
| B | ≤ 1 km | A shrine, a bridge, a stele, a lone pine on a spur |
Spacing rule: a point of interest every ≤ 255 m at run speed and ≤ 135 m at walk speed (see WORLD_FOUNDATIONS). Landmarks are cleared of occluding vegetation. **No giant natural arches or circular portals as iconic landmarks** (RJ-11).

## 7. Scale and Stage plan `[D]`
Playable region 1 targets about 4 × 4 km at 1:1 scale (Stage 01 world is 64 m chunks with ±76 m relief; in-play relief rises to ~300 m for region 1 by Stage 08). Monumental scale beyond that is delivered by authored non-playable skylines and distant terrain LOD, not by bigger playable area. Chunk and LOD costs are bound by `PERFORMANCE_CONSTITUTION.md`.

## 8. Regional identity table (provisional)
| Region | Rock | Zones | Palette | Signature |
|---|---|---|---|---|
| Terrace Reach | G1/G5 | Z0–Z1 | Green, wet grey | Rice terraces, mill-races, first Plumb quarry |
| Pillar Gorge | G1 | Z1–Z2 | Blue-green, mist | Joint-pillars, socketed galleries |
| Karst Basin | G2 | Z0–Z1 | Pale grey, green | Tower limestone, caves, silk-spider ravines |
| Redbed Rim | G4 | Z2–Z3 | Rust, buff | Dry fortresses, quarry roads |
| High Plateau | G3 | Z3–Z4 | Cold white, buff | Voids, snow, stelae |
Each region has its own palette, rock family, signature structure and sound bed. None uses lava, apocalypse skies or white-washed uniform cities as shorthand.

## Sources
- Zhangjiajie geology: https://www.revigorate.com/zhangjiajies-sandstone-pillars.html (secondary)
- Yarlung Tsangpo Grand Canyon: https://en.wikipedia.org/wiki/Yarlung_Tsangpo_Grand_Canyon
- Ghost of Tsushima landmark spacing: https://gamedeveloper.com/design/a-taxonomy-of-weenies-the-landmarks-that-define-i-ghost-of-tsushima-i-
