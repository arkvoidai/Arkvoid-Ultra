# Runtime Overview

## Frame flow

1. Browser input is translated by `InputManager` into a typed frame snapshot.
2. `GameRuntime` consumes one-shot actions and held movement state.
3. Character movement is resolved against the analytic ground function, world bounds and current simple obstacle list.
4. Gameplay systems process Qi pickups, altar attunement, training target durability and autosave.
5. `WorldBuilder` updates low-cost ambient motion.
6. The follow camera is smoothed toward the player.
7. The HUD receives a read-only progression/objective snapshot.
8. Three.js renders the scene.

## Ownership

- `GameRuntime`: orchestration, frame lifecycle and top-level world state.
- `InputManager`: keyboard, pointer and virtual controls.
- `PlayerCharacter`: visual hierarchy and low-cost procedural locomotion.
- `WorldBuilder`: deterministic environment composition and interactable references.
- `ProgressionSystem`: Qi and spirit-shard values and rank derivation.
- `SaveRepository`: versioned browser-local save validation and persistence.
- `GameHud`: DOM feedback and touch-control wiring.

## Next separation points

Before adding larger systems, move combat into a dedicated combat service, interaction selection into a query service, world entities into stable IDs, and save serialization behind an explicit schema migration layer. The current single runtime is an intentionally small vertical slice, not the final architecture.
