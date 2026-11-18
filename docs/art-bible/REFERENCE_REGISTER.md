# ARKVOID Reference Register

Date: 2026-11-18. This is the visual-reference database. **Nothing here is a production asset.** Five categories are kept separate and must never be mixed:

| Cat | Meaning | May ship in the game? |
|---|---|---|
| A | Inspiration-only images and pages (copyrighted or unknown terms) | **No.** Not stored in the repo, not traced, not used as textures |
| B | Licensed production assets (paid or permissioned, receipt on file) | Yes, with a provenance row |
| C | CC0 assets | Yes, with a provenance row (recorded even though attribution is not required) |
| D | Original generated concept references (AI or hand) | **No.** Direction only. Not shipped, and not used to derive production textures or models |
| E | Original production-ready 3D models | Yes, after `assets:validate` |

Rule: commercial game screenshots are Category A forever and never enter `public/`.

## Part 1. User-supplied references (Category D / A)
Ten images supplied by the project owner. They appear AI-generated; generator and terms unverified. Not stored in this repo. Identified by file name, size and hash prefix; full analysis in `USER_REFERENCE_ANALYSIS.md`.

| ID | File name as sent | Dimensions | sha256 prefix | Class | Principle studied | ARKVOID difference |
|---|---|---|---|---|---|---|
| U01 | character-02.webp | 1024×1536 | b655687c696841e5 | D | Low-angle hero framing; sheer-over-opaque layering | Realistic anatomy, functional costume, no floating platforms |
| U02 | character-01.webp | 1024×1536 | 04c23e16bb46d0ef | D | Foreshortening depth cue | No wings, no ribbon soup |
| U03 | world-skyrealm.webp | 1536×864 | 6d2dfa93cb34ba6b | D | Three-plane frame, single accent hue | Sourced waterfalls, no mirror floor, no giant portal |
| U04 | world-valley.webp | 1536×961 | fec8c8897cb0f391 | D | Geomorphic settlement logic; scale | No Roman arcades, hydrology made coherent |
| U05 | Screenshot_2026-11-06-17-33-02-470_com.openai.chatgpt.jpg | 1080×2400 (art ≈ 1080×608) | 9dd211d966d2185c | D | Lit monolith focal interior | Tally-script panels, structural oculus, no mirror floor |
| U06 | file_000000003e70…4612.png | 2154×730 | e1182b64d3456243 | D | Small-figure scale vista | No sky rings or luminous arches |
| U07 | 972c40c5-c819-4964-947d-83650132f5a3.png | 1536×1024 | bb6d994e4b5047e8 | D | Layered peak silhouettes | Single structural vocabulary, no aurora |
| U08 | file_000000003b80…f306.png | 1672×941 | 736f19f1ad046f52 | D | Fortification logic, faction banners | Red-bed geology, no lava rivers |
| U09 | file_00000000a0f0…6091.png | 1672×941 | 2f6b21ff70250f76 | D | Layered history, cold regional palette | Varied masonry, no sun-burst flare |
| U10 | file_000000007d68…1392111.png | 1672×941 | 37e5e654d15a214d | D | Concentric ring motif | Not used as geography; no space vistas |

## Part 2. External research sources
Class A for all pages and images (we cite and study them; we do not store or reuse). "Read" = fetched and read this session; "found" = appeared in search results only and was **not** read.

| ID | Source | URL | Publisher / creator | Type | Status | Research use | Copyright / permitted use | Principle | ARKVOID does differently |
|---|---|---|---|---|---|---|---|---|---|
| X01 | Where Winds Meet "Hidden Mountain 2.0" developer letter | https://www.wherewindsmeetgame.com/news/official/719devletter.html | NetEase / Everstone | Official developer text | Read | World structure, systems, art-direction claims | Citable; no reuse of text/art | Vertical region stacking; mist and wind driven by terrain | Original premise and visual grammar |
| X02 | Where Winds Meet world article | https://80.lv/articles/how-netease-built-an-authentic-wuxia-open-world-in-where-winds-meet | 80.lv | Trade press | Read | Scale target, research process | Citable | Scholar-reviewed authenticity | Our own research log per region |
| X03 | Black Myth: Wukong store page | https://store.steampowered.com/app/2358720/Black_Myth_Wukong/ | Game Science (Steam) | Official store text | Read | Official claims check | Citable | None visual beyond mythic setting | No myth IP used |
| X04 | Scanning article | https://www.shining3d.com/how-black-myth-wukong-turned-chinas-historical-and-cultural-heritage-into-realistic-game-digital-models-through-3d-scanning-technology | SHINING 3D (vendor) | Marketing | Read | 36 sites scanned, ZBrush, UE5 (vendor claim) | Citable; promotional | Reference-led construction | No heritage scans; own capture only |
| X05 | Ghost of Tsushima landmark taxonomy | https://gamedeveloper.com/design/a-taxonomy-of-weenies-the-landmarks-that-define-i-ghost-of-tsushima-i- | Game Developer | Trade article | Read | Landmark types, 30-second rule | Citable | Flags, breadcrumbs, spacing | 255 m run / 135 m walk spacing rule |
| X06 | FFXVI environment article | https://blog.playstation.com/2023/05/22/how-square-enix-built-final-fantasy-xvis-fantastical-believable-lived-in-world/ | PlayStation Blog | Official interview | Read | Believable-world rules | Citable | Defence logic, age, per-location dressing | Load-path rule |
| X07 | Elden Ring world design summary | https://80.lv/articles/a-look-at-the-world-design-of-elden-ring | 80.lv | Trade summary | Read (thin) | Little usable detail | Citable | Not used for decisions | n/a |
| X08 | Hanging Temple | https://en.wikipedia.org/wiki/Hanging_Temple | Wikipedia (CC BY-SA) | Encyclopedia | Read | Cliff construction facts | Do not copy text; facts only | Socketed beams, overhang shelter | Original forms from notch/span/ring |
| X09 | Foguang Temple | https://en.wikipedia.org/wiki/Foguang_Temple | Wikipedia | Encyclopedia | Read | Hall dimensions, bracket ratio | as above | Proportion as a design tool | Own module table |
| X10 | Dou-gong mechanical study | https://bioresources.cnr.ncsu.edu/resources/mechanical-behavior-of-dou-gong-brackets-in-chinese-traditional-timber-structures-an-experimental-study/ | BioResources (NC State) | Peer-reviewed paper | Read (abstract) | Bracket load behaviour | Cite | Layered load transfer | Stylised corbel stack |
| X11 | Yarlung Tsangpo Grand Canyon | https://en.wikipedia.org/wiki/Yarlung_Tsangpo_Grand_Canyon | Wikipedia | Encyclopedia | Read | Relief and vegetation zones | Facts only | Full climate range in one gorge | Invented Cleave |
| X12 | Zhangjiajie geology | https://www.revigorate.com/zhangjiajies-sandstone-pillars.html | Revigorate | Secondary web article | Read | Sandstone pillar formation | Cite as secondary; verify with a geology paper | Joint-controlled erosion | G1 family rule |
| X13 | Cultivation Novels Explained | https://www.writersdigest.com/cultivation-novels-explained | Writer's Digest | Magazine article | Read | Genre structure | Citable | Sects, stages, inheritances | Trade-based houses |
| X14 | Ghost of Tsushima guiding wind GDC | https://gdconf.com/news/see-how-ghost-tsushima’s-guiding-wind-came-life-gdc-2021 | GDC | Conference | Found, not read | Not used | n/a | n/a | n/a |
| X15 | Elden Ring landmark visibility (Destructoid) | https://www.destructoid.com/elden-ring-discovery-forge-of-giants-visible-from-first-step-start-of-game/ | Destructoid | News | Found, not read | Not used for decisions | n/a | n/a | n/a |
| X16 | Sword of Justice announcement | https://www.gamedeveloper.com/press-release/netease-games-reveals-sword-of-justice-a-groundbreaking-open-world-mmorpg | NetEase via Game Developer | Press release | Found, not read | Not used | n/a | n/a | n/a |
| X17 | FFXVI Game Informer feature | https://gameinformer.com/exclusive-feature/2023/06/06/creating-the-look-of-final-fantasy-16 | Game Informer | Feature | Found, not read | Not used | n/a | n/a | n/a |
| X18 | Image-search hits: Yarlung Tsangpo aerial, Wudang cliff temples | titles only (e.g. "A Stunning Aerial View Of The Yarlung Tsangpo Grand Canyon…", "The 'Forbidden City' on the cliff… Wudang") | Unknown publishers | Image search | Viewed in tool; **URLs not captured** | Visual orientation only | Unknown; treat as A | Gorge scale; cliff architecture | Not citable. Re-source from named photographers or institutions before relying on them |

### Gaps and honesty notes
- Image search returned results for only some queries (none for Hanging Temple, Zhangjiajie and Potala). **The external image research is therefore thin.** Real photographs from credible sources (national heritage bodies, named photographers, Wikimedia Commons with licence) must still be collected for: karst, Himalayan terrain, gorges, waterfalls, alpine forests, mist valleys, historic timber architecture, stone fortifications, mountain settlements, bridges, water systems.
- Final Fantasy XIV, Lost Soul Aside and Sword of Justice were not studied beyond search results.
- The six cultivation works in the brief were not studied individually (see WORLD_FOUNDATIONS).
- Character and digital-human references from game productions have not been gathered; the Character bible rests on my own anatomy and costume rules, not a verified reference set.

## Part 3. Acquisition rules
1. Every reference gets a row here before it is used in a design sheet.
2. Photographs for research: prefer Wikimedia Commons (licence shown), national heritage agencies, and named photographers who grant permission in writing.
3. Photographs for **production textures**: only CC0, own capture, or licensed with receipt (Categories B/C).
4. No category A or D image is traced, projected, or used in a model/texture pipeline.
5. AI-generated concept images made for ARKVOID: record tool, prompt summary, date, and an originality check; they remain Category D.
6. Review this register at the start of every art stage.
