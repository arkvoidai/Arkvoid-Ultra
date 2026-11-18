# ARKVOID Lighting Bible

Tags: `[V]` verified from a source read this session, `[K]` prior knowledge to confirm, `[D]` design decision. Renderer: Babylon.js 9.x (WebGL2 default) per `TECH_STACK_ADR.md`. Babylon 9 features cited: clustered lighting (WebGL2 and WebGPU), volumetric lighting (WebGPU compute with WebGL2 fallback), Frame Graph `[V]`.

## 1. Principles
1. **Value structure first.** Every vista has three value planes: dark foreground frame, lit mid-ground, stepped light distance (RP-01, RP-13).
2. **One light direction per scene.** Shadows must agree; no art-only fill that contradicts the sun.
3. **Warm key, cool shade, one accent hue** (RP-02). Accent is vermilion; resonance is tide-white.
4. **Emission is rare.** Emissive pixels ≥ 0.9 luminance ≤ 3% in play, ≤ 8% in set-pieces (VISUAL_IDENTITY).
5. **Atmosphere explains distance.** Use analytic aerial perspective; fog walls are not a substitute.

## 2. Time-of-day set `[D]`
| State | Sun elevation | Sun colour temp | Sky/ambient | Notes |
|---|---|---|---|---|
| Pre-dawn | −6° to 0° | n/a | 9000–11000 K blue ambient | Mist peak in Z0–Z1 |
| Dawn | 2–10° | 3000–3500 K | Pink-grey | Long shadows, valley inversion |
| Morning | 20–40° | 4500–5200 K | Clear | Mist burns off (Zhangjiajie-type mist forms early and breaks by mid-morning `[V]`) |
| Noon | 60–75° | 5600–6000 K | High contrast, short shadows | Worst for readability: add cloud shadow variety |
| Afternoon | 25–45° | 4800–5200 K | Warm key | Default screenshot state |
| Golden hour | 5–15° | 2800–3200 K | Warm/cool split | Limited to key moments, not every vista |
| Dusk | −4° to 3° | n/a | Deep blue | Lanterns become key lights |
| Night | < −6° | moon 4100–4500 K | Dark blue | Moon + lantern clusters |
Golden hour is not the default (U03, U04, U06 and U07 all use it; ARKVOID's default is afternoon).

## 3. Light source table `[D]`
| Source | Temp | Notes |
|---|---|---|
| Sun | see above | Cascaded shadows, 3–4 cascades; covers ≥ 120 m near, softer far |
| Torch | 1900–2200 K | Flicker 0.5–2 Hz |
| Paper lantern | 2400–2800 K | Soft, wide |
| Bronze oil lamp | 2000–2300 K | Small, with visible wick |
| Resonance (R3–R4) | 6500–8000 K | Faint, node-only, no bloom halo |
| Moon | 4100–4500 K | Low intensity |
Dynamic lights near the player ≤ 32 with clustered lighting `[D]`; the measured cost is a Stage 02 gate.

## 4. Atmosphere and weather `[D]`
| State | Visibility | Use |
|---|---|---|
| Clear | ≥ 20 km | Vistas, default |
| Haze | 8–12 km | Afternoon depth |
| Valley mist | Local layer, 20–150 m thick, at the valley floor | Dawn only, in Z0–Z1 |
| Cloud inversion ("sea of cloud") | Below a fixed height band | **Event, not default**; occurs a few times per day cycle, at dawn after rain (RJ-03) |
| Rain | 300–800 m | Wet materials, reduced contrast |
| Storm | 150–400 m | Story beats only |
| Snow | 100–500 m | Z3–Z4 |
Mist should react to terrain (valley pooling), which Where Winds Meet also reports `[V]`.

## 5. Exposure and grading `[D]`
- Tone map: ACES-style filmic (as in Stage 01 `ACESFilmicToneMapping`), exposure auto-adapted with limits (EV range ±2).
- Target mean luminance of the scene ≈ 0.18 (mid-grey) in gameplay shots; cinematic shots may drop to 0.10 for night scenes.
- Contrast ratio key:fill ≈ 3:1 in outdoor daylight, 8:1 in interiors.
- Colour grading is per region (a LUT per region) and may not exceed ±15% saturation change from base.
- No bloom halos beyond 4% of screen width; bloom threshold above 1.0 so ordinary white stone does not glow.

## 6. Image-based lighting
- One HDRI per time-of-day state, prefiltered and compressed. Candidate (CC0, verified): Poly Haven "Overcast Soil" by Sergej Majboroda, soft overcast, 4K EXR is 20.31 MB, so it must be reduced before shipping `[V]`. It is an overcast fallback, not the hero sky.
- A procedural sky drives sun and scattering; HDRI only for ambient and reflections.

## 7. Interiors
Single hard source through an oculus or window, plus warm local points. Interior ambient must come from bounce approximations (hemispheric, probes) and never exceed 10% of the exterior ambient value. Rooms are dark by default, with light concentrated on the focal object (RP-03).

## 8. Validation
Each locked vista has a reference screenshot, histogram, and a signed-off look. Value-structure test: foreground frame mean luminance ≤ 0.6 × mid-ground mean; distance planes step up in luminance and down in contrast by ≥ 15% per plane (run once the screenshot harness exists; not yet measured).
