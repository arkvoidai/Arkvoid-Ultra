# ARKVOID Production Roadmap

Roadmap order is dependency-driven. A stage advances only when its exit criteria are met; dates are not substitutes for evidence.

## Stage 00 — Foundation runtime (current)

**Goal:** establish a real, runnable 3D game application.

- Three.js scene, camera, renderer lifecycle and resize handling.
- Procedural valley height-field, lake basin, distant ridges, sect compound blockout and instanced vegetation.
- Third-person player blockout, input, follow camera, jump and sprint.
- Qi pickups, altar attunement, training target durability and versioned local save.
- Strict TypeScript, linting, tests, CI and project constitutions.

**Exit:** CI passes; runtime can be launched in a browser; player can traverse and complete the first attunement loop; limitations are recorded.

## Stage 01 — Playable vertical slice

**Goal:** make a short route feel like a coherent game sequence.

- Replace geometric character blockout with an original rigged character asset.
- Establish animation state machine: idle, walk, run, turn, jump, land, attack, hit and interact.
- Implement a real combat loop, hit windows, hit reactions and recovery.
- Add one original creature encounter with readable telegraphs and reward rules.
- Add quest/state progression with explicit data contracts.
- Add sound, music direction, accessibility and settings.
- Capture CPU/GPU profiling on named desktop and mobile devices.

**Exit:** a 10–15 minute repeatable playtest with no placeholder controls and documented performance.

## Stage 02 — World art and asset pipeline

**Goal:** move from procedural blockout to a distinctive production environment.

- DCC scale and export conventions.
- Modular architectural kit, material library, trim sheets and terrain materials.
- Original character, creature, weapon and prop asset pipelines.
- Rig/retarget standards, animation review and collision authoring.
- LODs, impostors where appropriate, occlusion and distance culling.
- Lighting, atmosphere, water and post-process review against device budgets.

**Exit:** one polished environment route with production-owned assets and complete provenance.

## Stage 03 — World systems

**Goal:** establish world-cell ownership and believable local simulation.

- World coordinates, cell identity, deterministic seed and cell lifecycle.
- Terrain/prop streaming with load, unload, cancellation and failure recovery.
- Navigation data, traversal constraints and encounter authoring.
- Time/weather foundations and bounded ambient simulation.
- Event ledger for player actions and world consequences.

**Exit:** a measured multi-cell traversal with no duplicate state, missing collision or uncontrolled memory growth.

## Stage 04 — Persistent world backend

**Goal:** move important player/world state from local prototype storage to a secure service.

- Authentication and session lifecycle.
- Server-authoritative player progression and inventory.
- Versioned save schema, migrations and recovery.
- Idempotent command processing and event history.
- Anti-cheat boundaries and abuse controls.
- Observability, rate limits, backups and incident recovery.

**Exit:** integration tests demonstrate durable, recoverable player state and clear authority boundaries.

## Stage 05 — Living characters and factions

**Goal:** give the world credible inhabitants without faking intelligence.

- NPC schedules and state machines.
- Navigation, perception and interaction boundaries.
- Dialogue authored with original narrative voice and state-aware context.
- Memory records with expiry, relevance and privacy controls where required.
- Faction reputation, relationships and world-event consequences.
- Simulation budget, offline catch-up rules and deterministic replay tests.

**Exit:** named behaviours have tests and measurable simulation cost. “AI NPC” is reserved for implemented capabilities, not stationary meshes or scripted barks.

## Stage 06 — Expanded world and online play

**Goal:** extend geography and concurrency without sacrificing world coherence.

- Region streaming and travel transitions.
- Server authority, replication and conflict resolution.
- Social systems, cooperative play and moderation/security.
- Economy, item provenance and exploit monitoring.
- Content authoring, quest tools and live-operations safeguards.

**Exit:** a production-like environment test with defined concurrency, latency and recovery targets.

## Stage 07 — World-computing research

**Goal:** investigate device-independent embodied runtime only after the game is proven.

- Runtime abstraction and input/output device contracts.
- Spatial interaction and accessibility research.
- Smart-glasses feasibility, thermal, battery, optics and cost studies.
- Separate product validation and hardware safety review.

**Exit:** validated user need, prototype evidence, cost model and technically credible integration path. No hardware promise is implied by this roadmap.
