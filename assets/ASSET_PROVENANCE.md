# Asset Provenance

Every file in `public/assets/` needs a row in **Shipped assets** (the validator matches on the file path). Candidates are not approved until downloaded, licence-checked on the asset page at download date, and moved to Shipped.

## Shipped assets
| File location | Asset name | Source URL | Creator | Licence | Attribution required | Modifications | Date acquired |
|---|---|---|---|---|---|---|---|
| _(none)_ | | | | | | | |

## Candidates (not downloaded; no file exists in this repo)
| Asset | Type | Source | Creator | Licence | Verified | Notes |
|---|---|---|---|---|---|---|
| Overcast Soil | HDRI (1K–16K, EXR/HDR) | https://polyhaven.com/a/overcast_soil | Sergej Majboroda | CC0 | Yes, page read 2026-11-18 | Soft overcast light. 4K EXR is 20.31 MB; convert to a small prefiltered env map before shipping |
| Rock, limestone, stone wall, carved stone, bronze, aged wood, water, vegetation, ground materials | Textures / models | Poly Haven, ambientCG | not recorded | CC0 claimed by both sites | **No** | Specific asset pages were fetched but I did not keep their creator and licence details, so none are listed. Re-open each page, record name, creator, licence and resolutions, then add it here |

## Licence notes
- Poly Haven: CC0, commercial use allowed; logos and site UI are not CC0.
- ambientCG: CC0 per homepage; its licence page was not readable. Confirm before first import.
- BabylonJS/Assets: CC-BY-4.0 by default with per-folder exceptions; do not import without a per-asset check. Do not use Mixamo content from it.
- Khronos glTF-Sample-Assets: mixed per-model licences; pipeline testing only, never shipped without a row above.
