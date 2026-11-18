# ARKVOID Visual Identity

Date: 2026-11-18. Evidence tags: `[V]` verified from a source read this session, `[D]` ARKVOID design decision (original, adjustable by the art director), `[K]` prior knowledge to verify. Companion files: `USER_REFERENCE_ANALYSIS.md`, `WORLD_FOUNDATIONS.md`, `REFERENCE_REGISTER.md`.

## Identity in one sentence
**Load-bearing fantasy [D]:** an ancient mountain civilisation where every structure shows how it stands, every landscape shows its rock, and spiritual power shows up as *resonance in matter*, not as glow.

## Three pillars [D]
1. **Load path.** Nothing is decoration without a structural reason. Ornament grows out of joinery, anchoring and survey marks.
2. **Strata.** Every landscape declares a rock family, a climate zone and a water source before any art is made.
3. **Resonance.** Spiritual energy is made visible through physical response (standing-wave patterns in water, dust, frost and cloth; ringing metal; leaning flames). Emission is the last resort, not the default.

## Why this separates ARKVOID from the reference set
The ten user images share one fingerprint: gold, glow, cloud sea, waterfalls, small pagodas, floating forms and planets (`USER_REFERENCE_ANALYSIS.md`). Prompt 03 §7 lists exactly these as overuse risks. ARKVOID keeps the composition craft and replaces the vocabulary with the three pillars above.

## Palette [D]
| Role | Colours | Use |
|---|---|---|
| Ground | Cold limestone grey-green, ash, sandstone buff | 60–70% of surface area |
| Structure | Weathered cedar brown, oxidised bronze (verdigris blue-green), dark iron | Architecture, tools |
| Cloth | Undyed hemp/ramie, indigo, madder-brown, charcoal | Costume |
| Authority accent | **Vermilion lacquer** | Sect banners, gate posts, a few maples. ≤ 3% of a frame |
| Resonance | **Tide-white**, cool 6500–8000 K | Only for resonance events |
| Tarnished metal | Muted gold-bronze | ≤ 2% of surface area, never emissive |

Measurable checks (run on the standard benchmark route screenshots once the capture tool exists): vermilion ≤ 3% of pixels; emissive ≥ 0.9 luminance ≤ 3% in normal play and ≤ 8% in set-piece cinematics; no saturated yellow field > 1%.

## Design grammar: Notch, Span, Ring [D]
All ornament, insignia, inscription and weapon decoration come from three primitives plus one rule.
- **Ring:** closed circle. Means enclosure, authority, the void (the "Ark" in ARKVOID). Thickness encodes standing.
- **Span:** straight line. Means a load path or trade axis.
- **Notch:** a V cut on a ring or span edge. A count of 1–9 encodes lineage or rank.
- **Rule:** every motif must be buildable by a craftsperson with the house's tools. If it could not be carved, cast, woven or joined, it does not exist.

### Sect insignia (provisional houses; see WORLD_FOUNDATIONS)
Insignia = ring + one span orientation + 1–9 notches. Span orientation by house trade: horizontal beam (timber), vertical plumb (stone), diagonal brace (bronze), crossed twill pair (weaving), arc (water). Tests: legible in one colour at 64 px; reproducible as embroidery on a 12-thread-per-cm weave.

### Ancient inscription ("tally script") [D]
Strokes limited to span, notch, ring and bar. Written in vertical columns on stone and bronze. Carved 4–8 mm deep. Used on steles, thresholds and bells. A generator tool (later stage) will emit deterministic panels so no panel contains random pseudo-glyphs. It is not a cipher for any real script.

### Embroidery
Pattern follows the weave grid: counted stitches, not freehand curves. Maximum two thread colours per garment plus the base. No metallic thread except on one ceremonial rank.

### Weapon motifs
Weapons express the house trade (joint-wood staff, stone-weighted hammer, cast-bronze blade, braided cord weapon, water-gauge spear). Decoration is cast or carved notches only. Silhouette test: each weapon identifiable as a flat shape at 10 m.

### Spiritual-energy visualisation: resonance scale [D]
| Level | Visible effect | Radius | Emission allowed |
|---|---|---|---|
| R0 | None | 0 | No |
| R1 | Ripple lines on water, dust drifts to nodal lines, a bell or cloth hem trembles | ≤ 1 m | No |
| R2 | Flames lean, frost blooms at nodes, hum audible, loose small objects creep | ≤ 5 m | No |
| R3 | Standing-wave rings in sand or snow on the ground, air shimmer | ≤ 25 m | Faint tide-white at nodes only |
| R4 | Sustained patterns across a lake or glass floor, landmark-scale | landmark | Yes, within the 3% / 8% caps |

## Prohibitions [D] (hard rules)
- No floating rocks, islands or platforms. Exception: a single story-approved "suspended installation" per region, with a visible tether or mechanism.
- No aurora, planets, ring-skies or orbit lines in the playable sky.
- No waterfall without a catchment (see ENVIRONMENT).
- No mirror-polished floors (roughness floor in MATERIAL_LIBRARY).
- No mixed-vocabulary buildings (one structural system per building).
- No winged, pointed-ear or non-functional-costume humans in the base cast.

## One-universe test (review checklist)
A new asset passes if a reviewer can answer yes to all: (1) shows a load path or ties to a trade; (2) uses only the palette and metal budgets; (3) its ornament is built from notch/span/ring; (4) it could exist in the same frame as an existing asset without style conflict; (5) it contains no item from the prohibitions.
