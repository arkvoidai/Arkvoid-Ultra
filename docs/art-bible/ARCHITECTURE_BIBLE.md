# ARKVOID Architecture Bible

Tags: `[V]` verified from a source read this session, `[K]` prior knowledge, `[D]` ARKVOID design decision. Principle: **one structural system per building; show the load path.**

## 1. What the real references teach (and what we take)
| Reference | Verified facts | ARKVOID takeaway |
|---|---|---|
| Hanging Temple (Xuankong), Shanxi | Cliff-built ~75 m above ground; oak crossbeams fitted into sockets chiselled in the cliff; main support hidden in bedrock; ~27 beams carry the main buildings; iron chains and beams reinforce; sits under a summit that shelters it from rain and sun; needs regular conservation `[V, Wikipedia]` | Cliff buildings are socketed, back-anchored and sheltered under an overhang; they visibly need maintenance (ladders, scaffolds, replaced beams) |
| Foguang Temple East Hall (857 CE) | 34 × 17.7 m hall, single storey on a stone platform, seven bays by four; bracket set height given as "one-second as high as the column", an apparent typo for one-half that the page does not confirm, so the ratio is **unverified**; inner and outer column rings joined by beams; no restoration since the 17th century, water damage and rot noted `[V, Wikipedia]` | Proportion is knowable and measurable; a large bracket-to-column ratio is a strong silhouette (confirm the real ratio from a measured drawing before copying any number); aged timber should show water damage at eaves |
| Dou-gong bracket test | Brackets transfer roof-beam loads to the column frame; scale tests failed first at the base block; one arrangement carried 15% more load; transverse arches limited layer slip `[V, BioResources paper]` | Our corbel stacks are layered with interlocking members and a base block; arrange a failure story (the base block is the replaced part) |

## 2. Vocabulary rule `[D]`
East-Asian-influenced timber-and-stone is the base *engineering logic* (post-and-beam, bracket stacks, deep eaves, stone platforms), not a costume. **Original forms** come from the Notch/Span/Ring grammar. No Roman arcades, gothic spires or classical columns (RJ-07). Each building declares its house and its structural system on its design sheet.

## 3. Module and proportion system `[D]`
Base module **u = 0.30 m**.
| Element | Rule |
|---|---|
| Door | 8u high × 4u wide (2.4 × 1.2 m) for public halls; 7u for homes |
| Stair riser | 0.15 m; tread ≥ 0.30 m; landing every ≤ 12 risers |
| Column | 10–14u (3.0–4.2 m); diameter = height / 8 to 10 |
| Bracket stack height | 0.25–0.50 of column height (Beam house at the high end; design range, not a measured historical ratio) |
| Eave overhang | ≥ 0.6 × column height for timber walls (rain protection) |
| Platform base | ≥ 0.15 × column height, stone, with drainage |
| Parapet | 1.0–1.1 m |
| Corridor width | ≥ 2.4 m for two-way traffic; 1.2 m for service |
These are first-draft numbers for the blockout kit; adjust only by changing this table and the kit generator together.

## 4. Cliff construction types `[D]`
1. **Socketed gallery:** plank way on beams slotted into rock sockets at ≤ 2.5 m spacing with a handrail and a back-brace. Max unsupported span 3 m.
2. **Overhang hall:** a timber hall set beneath a rock overhang, wall flush to the rear rock, floor on socketed beams. Roof edge never exceeds the overhang line.
3. **Back-anchored terrace:** stone retaining wall with weep holes, battered 1:6, with tie-beams into the slope.
4. **Cantilever bridge:** stacked timber beams, each layer projecting 0.3–0.6 m beyond the previous, ending in a central span; seen on timber ravine crossings `[K]`.
5. **Stone arch bridge:** semicircular or segmental, rise/span 1:2 to 1:4; spandrel drains; parapet.
6. **Chain or rope bridge:** Cast house chains or Weft house rope; anchored in sockets with visible windlass pits.
7. **Viaduct/aqueduct:** stone arches carrying a water trough; belongs to the Race house.
A cliff building is rejected if its floor has no visible way for the load to reach rock.

## 5. Fortification logic (RP-06) `[D]`
- Wall towers at ≤ 40 m spacing (crossbow overlap); a single gate approach covered from both sides; a choke bridge before the gate; a dry ditch or cliff in front.
- Defensive features must make sense on terrain: a wall with a cliff beside it is moved or the cliff becomes the defence (FFXVI example `[V]`).
- Wear: broken parapet sections and patched stone, since "you wouldn't have a nice, clean, unbroken wall after three centuries" (FFXVI developer comment `[V]`).

## 6. Ceremonial and interior spaces
- **Stele hall (RP-03):** a centrally lit engraved monolith on a stepped dais. Light only from an oculus with a visible structural ring; dark outer bays. Tally script panels only (no random glyphs).
- **Archive:** stacked bays with real shelf ladders and floor loads; no circular floating balconies without columns.
- **Bell tower:** Cast house; a bell is a resonance instrument (R2 events).

## 7. Density rule
Avoid repeated tiny pagodas as texture (RJ-10). Within a vista: ≤ 3 distinct roof types; every secondary building must differ in footprint and orientation from its neighbour by ≥ 10%.

## 8. Original ornament examples (notch/span/ring)
- **Bracket nosing:** stepped notches along the end of each member, depth equal to member thickness / 6.
- **Ridge crest:** a row of rings (clay or bronze) whose count marks the house rank.
- **Gate post:** span lines inscribed vertically with notch counts for the hall's lineage.
- **Floor inlay:** concentric rings only around real structural centres, such as a stele base or a well, never as pure decoration.

## Sources
- https://en.wikipedia.org/wiki/Hanging_Temple · https://en.wikipedia.org/wiki/Foguang_Temple
- https://bioresources.cnr.ncsu.edu/resources/mechanical-behavior-of-dou-gong-brackets-in-chinese-traditional-timber-structures-an-experimental-study/
- https://www.playstation.com blog (FFXVI): https://blog.playstation.com/2023/05/22/how-square-enix-built-final-fantasy-xvis-fantastical-believable-lived-in-world/
