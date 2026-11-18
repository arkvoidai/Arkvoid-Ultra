# ARKVOID World Foundations and Cultivation Design Analysis

Date: 2026-11-18. Tags: `[V]` read this session, `[S]` secondary, `[K]` prior knowledge, `[D]` ARKVOID design decision. All names below are **provisional placeholders** for the narrative bible, chosen only to drive visual design. They are not drawn from any existing work.

## 1. Cultivation fiction: structural analysis
**Sources actually read:** Writer's Digest, "Cultivation Novels Explained" `[V]`. Search results also surfaced genre primers, but I did not read them. **The six works named in the brief (Perfect World, Battle Through the Heavens, Renegade Immortal, Library of Heaven's Path, Eternal God Emperor, Tales of Demons and Gods) were not individually studied**: their Wikipedia pages were blocked and the searches returned only link lists. This analysis is therefore genre-level. Per-work study is an open task; the rule that no names, characters or plots are carried into ARKVOID stands regardless.

| Principle | Genre pattern `[V]` | What ARKVOID does `[D]` |
|---|---|---|
| Power hierarchy | Stage-based progression; each stage is a large strength jump; talent plus "fortunate encounters" | Registers of resonance (see §3); progression tied to places and trades, not only fights |
| Sects | Modelled on martial schools: master on top, tiers (outer, inner, core), loyalty traded for training and resources | Houses defined by a **structural trade**; rank readable from insignia notch count |
| Hidden inheritances | Manuals and techniques restricted to the loyal or gifted; pills and weapons withheld as leverage | Inheritances are *physical places and inscribed stones* in the world; discovery is exploration |
| Jianghu | Arena of conflict: orthodox, heretical and dark factions | Factions are rival trades and water rights, not good/evil |
| Setting | Fantasy ancient China blending dynasties; bamboo forests, rivers, canals, rice fields | Original gorge civilisation; terraced farming and canals reused as *geography logic*, not dynastic cosplay |
| Scope expansion | Personal advancement → sect politics → jianghu-wide → multi-realm conflict | Region 1 (one terrace) → the Cleave (gorge) → the Rim (high plateau) → the Hollow (deep) |
| Resource economy | Pills, medicinal baths, weapons as leverage | Resonant stone, tuned bronze, silk from gorge spiders, glacial water rights |

## 2. Game-world principles extracted (no assets or maps copied)
| Source | Principle | ARKVOID rule |
|---|---|---|
| Ghost of Tsushima: "weenies" system, 30-second rule `[V]` | Tall "flags", ground "breadcrumbs" and short flags; players should be drawn by something "every 30 seconds or less" (they need not reach it, only see it calling); trees removed when they hide a landmark | At run speed 8.5 m/s (`PLAYER.runSpeed`), 30 s is ≈255 m: a visible point of interest within **255 m** while running, **135 m** walking (4.5 m/s) `[D]` |
| Where Winds Meet "Hidden Mountain 2.0" dev letter `[V]` (describes that update, not the whole game) | 4 main areas, 14 sub-regions, vertical exploration depth over 2,000 m, 10,000+ interactive NPCs, mist that "dynamically reacts to the terrain", revamped wind fields moving foliage | Vertical stacking as region structure; NPC routines are a Stage 06 requirement; mist and wind as terrain-driven systems |
| Where Winds Meet (80.lv) `[V]` | Historical-scholar review; seamless ~12×12 km target; proprietary engine | Research-led authenticity; a scale reference for our world streaming |
| FFXVI environment article `[V]` | Defences must make in-world sense (a wall was redesigned because a 15 m cliff made it pointless); structures show age; set dressing chosen per location; lore informs visuals | Load-path rule; every location has a one-line backstory before art starts |
| Black Myth: Wukong `[V]` | Steam page makes no visual or tech claims. A scanner-vendor article says 36 heritage sites were scanned, sculpted in ZBrush, built in UE5 `[V, vendor claim]` | Real-world reference-led construction. Scans of heritage sites are not available to us; we use our own photogrammetry only where we can capture it legally |
| Elden Ring `[S]` | Search results indicate far landmarks visible early; the article I read was too thin to use | Not claimed as verified. Distant Tier-S landmarks are visible from the start region `[D]` |
| Lost Soul Aside, Sword of Justice, FFXIV `[S]` | Found in search; not read in depth | Not used for any decision |

## 3. Original premise (provisional) `[D]`
**The Cleave:** a continental fault gorge, kilometres deep. Civilisation is stacked on its walls by altitude, with water and farming terraces below, high plateau above, and the **Hollow**, an ancient sealed void, at the bottom. The project's "Ark/Void" idea becomes concrete: ring-shaped sinkholes called **Voids** punctuate the plateau, and the old civilisation built around them.

**Tuning (cultivation):** practitioners tune their bodies to the mountain's tone. Registers (placeholders): Murmur, Hum, Chord, Peal, Toll. Each maps to a resonance visualisation level R1–R4 (VISUAL_IDENTITY).

**Houses (visual factions), each a structural trade:**
| House | Trade | Palette lean | Architecture | Weapon |
|---|---|---|---|---|
| Beam | Timber and joinery | Cedar, vermilion | Cantilever halls, socketed galleries | Joint-wood staff, spear |
| Plumb | Stone | Grey, buff | Retaining terraces, stelae | Stone-weighted hammer |
| Cast | Bronze | Verdigris, iron | Bells, gates, chain bridges | Cast blade |
| Weft | Textile and dye | Indigo, madder | Rope and cloth structures, dye-works | Braided cord weapon |
| Race | Water | Pale stone, blue-grey | Aqueducts, cisterns, mill-races | Water-gauge spear |

Each house has *a reason to fight over*: water rights, resonant stone quarries, silk-spider ravines.

## 4. Open work
1. Individual study of the six named works (names withheld from ARKVOID).
2. Narrative bible: history, calendar, naming. Nothing above is canon yet.
3. Native-language and cultural review of any East Asian vocabulary used in public-facing text.
