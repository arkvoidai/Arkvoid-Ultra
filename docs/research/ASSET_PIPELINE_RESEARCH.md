# ARKVOID Asset Pipeline Research

Date: 2026-11-18. Legend: `[V]` primary page read this session, `[K]` prior knowledge to confirm with `--help` at first run, `[S]` secondary.

## Policy
1. Source files live in `assets/source/` (never served). Only processed `.glb` files enter `public/assets/models/`.
2. **No model reaches the playable world without passing `npm run assets:validate`**: format (Khronos validator), material and performance budgets, and a provenance row. CI runs it on every push.
3. Only `.glb` is served. Textures are KTX2 for production; WebP is allowed only as a labelled interim.
4. Geometry compression: **meshopt** (not Draco). Reason: meshoptimizer's codec also covers morph targets and keyframe animation per glTF Transform's `meshopt` command description [V]; Draco compresses geometry only [K].

## Tool review

| Tool | Licence | Role | Evidence |
|---|---|---|---|
| glTF Transform (`@gltf-transform/core, extensions, functions, cli`) | MIT [V] | Scripted optimisation + our validator's inspection API | CLI `optimize`, `meshopt`, `draco`, `resize`, `webp`, `uastc`, `etc1s` [V]; npm page showed CLI 4.2.0 (may be stale; socket.dev listed 4.4.x versions [S]); Node LTS [V]. `simplify`, `lod`, `validate`, `inspect` not named on the pages I read, so assume nothing about them [V]; the `functions` package exposes `dedup`, `prune`, `resample`, `textureCompress` [V]. |
| meshoptimizer | MIT [V] | Vertex-cache/overdraw optimisation, simplification (`meshopt_simplify`, attribute-aware variants), codec; `EXT_meshopt_compression` / `KHR_meshopt_compression`; `gltfpack` CLI; npm `meshoptimizer` [V]. Repo references tag v1.2 [V]. |
| glTF Validator | Apache-2.0 [V] | Format conformance. CLI `gltf_validator`, npm `gltf-validator`, JSON report, non-zero exit on errors [V]. Supports KHR_mesh_quantization, KHR_texture_transform, material extensions [V]. |
| Blender | GPL-3.0 as an application [V] | Authoring. Exporter licence and the "output files are not GPL-covered" point were **not confirmed** (pages blocked/silent); confirm from the Blender licence FAQ before relying on it [K]. Blender itself is never shipped or linked. |
| KTX / Basis Universal | n/a | `uastc` and `etc1s` commands exist in glTF Transform [V]. Whether they require the external `toktx` binary (KTX-Software) is `[K]` yes; the README did not say. |
| glTF specification repo | n/a | Not reviewed in this session. |

## Pipeline (reproducible, config-driven)

```
assets/source/<class>/<name>.glb        (from Blender export, see settings below)
   │  1. validate source        gltf-validator (errors fail; warnings reviewed)
   │  2. process                tools/assets/process.mjs → steps in tools/assets/pipeline.json
   │  3. validate output        tools/assets/validate.mjs
   │        • gltf-validator: 0 errors, 0 warnings
   │        • budgets.json by class (triangles, materials, texture size, mime types, joints)
   │        • provenance row exists in assets/ASSET_PROVENANCE.md
   ▼
public/assets/models/<class>/<name>.glb
```
Files written: `tools/assets/validate.mjs`, `tools/assets/process.mjs`, `tools/assets/pipeline.json`, `tools/assets/budgets.json`, `tools/assets/README.md`. **They have not been executed**: no GLB exists and the packages cannot be installed here. They fail closed: if GLBs exist but the validation packages are missing, validation exits non-zero.

Default processing step (syntax taken from the glTF Transform README [V]): `gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp`. The KTX2 step (`etc1s` for colour, `uastc` for normal maps, `--slots` filters) must be confirmed with `gltf-transform <cmd> --help` and `toktx` availability before replacing the WebP interim.

### Why KTX2 for production [K]
WebP/PNG/JPEG shrink download size but are decoded to full RGBA in GPU memory; KTX2/Basis transcodes to GPU-compressed formats (ASTC on mobile, BC on desktop), cutting VRAM and bandwidth. This is the main mobile lever for ARKVOID's material-heavy look. Measure VRAM before and after on a Tier C device.

### Budgets (initial; derived from ART_DIRECTION_CONSTITUTION, tune with measurements)
| Class (folder) | Max triangles | Max materials | Max texture px | Max joints |
|---|---|---|---|---|
| `props` (default) | 8,000 | 2 | 2048 | 0 |
| `environment` | 8,000 | 3 | 2048 | 0 |
| `characters` (LOD0) | 60,000 | 6 | 2048 | 120 |
| `creatures` | 60,000 | 6 | 2048 | 120 |

### Blender export settings to standardise [K, confirm against Blender manual for the installed version]
glTF Binary (.glb); +Y up; apply modifiers; export only selected/visible collection; materials "Export"; images "Automatic"; tangents off unless normal maps need them; animation sampling on for baked bones; no cameras/lights. Textures are re-encoded by the pipeline, so export once at source resolution.

### Mesh partitioning, LOD, UVs
- LOD: author LOD1/LOD2 explicitly for characters (budgets in Art Direction doc); use meshopt simplification for props and verify visually. glTF Transform's own LOD/simplify commands were not confirmed on the pages read [V], so treat as unverified until `--help` shows them.
- Large kits: split by function (modular architecture pieces under 8k triangles) so thin instances / instancing remain effective.
- UV: 0–1, no overlap for baked AO, consistent texel density (512 px/m hero, 256 px/m environment per Art Direction).
- Dedup materials/textures with the `dedup` function in the pipeline.

## Test material
Khronos glTF-Sample-Assets is the validator/loader test corpus. It is **not** a licence-uniform source: each model carries its own licence in its folder README, one example is CC-BY-4.0 (Wayfair/Eric Chadwick), and the maintainers say unsuitable-licence models were removed [V]. Use only to test the pipeline locally; do not ship, unless a specific model's licence is recorded in provenance.

## Sources
- https://github.com/donmccurdy/glTF-Transform · https://github.com/zeux/meshoptimizer
- https://github.com/KhronosGroup/glTF-Validator · https://github.com/KhronosGroup/glTF-Sample-Assets
- https://github.com/blender/blender
