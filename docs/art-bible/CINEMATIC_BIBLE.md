# ARKVOID Cinematic Bible

Tags: `[D]` design decision unless marked. All cinematics are **real-time, in-engine**, using the same assets as gameplay; no pre-rendered cheats.

## 1. Principles
1. **Camera obeys physics:** a camera has a body; no passing through walls; moves have inertia.
2. **Scale first:** the first shot of any region shows a person against the land (RP-07, U06).
3. **Light tells the story:** the scripted lighting state matches the Lighting Bible, not a separate "cinematic" light that contradicts the world.
4. **Restraint:** no lens-flare spam, no constant slow-motion, no sun burst in every shot (U09 sun burst is not repeated).

## 2. Shot language
| Shot | Lens | Camera | Use |
|---|---|---|---|
| Vista | 24–35 mm equivalent | High or ground, locked or slow push, 3-plane composition (RP-01) | Region reveal; figure ≤ 8% frame height |
| Overlook | 28–35 mm | From a ledge with a foreground frame (U04) | Designed gameplay moment at a gateway |
| Walk-and-talk | 35–50 mm | Eye-level, tracking | Dialogue |
| Close | 50–85 mm | Slight low or level | Emotion; eye contact |
| Authority (hero) | 24–35 mm | **Low angle** (RP-08) | Rank, arrival, boss reveal. Not the default |
| Action | 24–40 mm | Handheld-like, kept readable | Combat |
| Interior focal | 24–35 mm | One-point perspective on the lit stele (U05) | Revelation |

## 3. Colour scripting
Each act has a **colour script**: one dominant ground hue, one accent hue, and a light state. Region identity (ENVIRONMENT §8) drives it. Transitions between acts are carried by *light and weather change*, not a hard grade.

## 4. Editing and pacing
- Average shot length: 4–8 s in explore/dialogue, 1.5–4 s in action.
- Reveal pattern: partial view (foreground frame) → full vista over ≥ 4 s.
- Keep 180° rule in dialogue; eyeline match; character eyes remain visible > 80% of dialogue time.
- Cut on motion in combat.

## 5. Depth of field and effects
- Cinematic DOF allowed in close shots only; gameplay DOF off.
- Motion blur low (shutter 90–180°), disabled in gameplay by default.
- Film grain ≤ 3% amplitude; chromatic aberration ≤ 0.2%; vignette ≤ 15%.
- Resonance effects use the R0–R4 scale; set-piece cap 8% emissive.

## 6. Technical standards
- Aspect: 2.39:1 letterbox for cut-scenes, 16:9 for in-world camera moves.
- Capture in engine at 30 fps; playback on Tier A at 60 where possible.
- Budget: cinematic mode may use hero LODs and extra shadow cascades if Tier A frame time stays ≤ 16.6 ms; Tier B/C fall back to gameplay LODs.
- Facial animation uses the hero rig (CHARACTER §6).
- Audio: every shot has an ambient bed; a resonance hum scales with R-level.

## 7. Forbidden
Floating-island flyovers, planet or orbit shots in the playable game, aurora, "magic circle with glow" as a transition, text-heavy lore dumps over still images.
