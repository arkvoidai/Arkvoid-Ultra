# ARKVOID Roadmap

Each stage ends with: green `npm run check`, green `npm run build`, running game, ledger updated.

## Stage 01 — Foundation (this stage)
Repo constitution, tooling, runnable 3D runtime: fixed-step loop, input, third-person controller, terrain chunk streaming, AABB collision, HUD, logging, asset-failure strategy, unit tests.

## Stage 02 — Traversal and world feel
Slope limits and sliding, water volumes, day/night lighting, sky and fog system, camera collision, gamepad support, settings menu with persisted preferences.

## Stage 03 — Character and animation
Real rigged character GLB, animation state machine (idle/walk/run/jump/fall), IK foot placement, LOD, asset pipeline (gltf-transform, KTX2). Evaluate Rapier.

## Stage 04 — Combat core
Hit detection, stamina/health, enemy archetype with real behaviour loop, lock-on camera, damage data tables.

## Stage 05 — Cultivation systems
Typed realm/stage data, qi resource, meditation, technique unlocks, materials and inventory.

## Stage 06 — Settlements and NPCs
Interiors, NPC schedules and dialogue, sect encounters, quest state machine.

## Stage 07 — Persistence and backend
Authentication, server-validated saves, authoritative economy.

## Stage 08 — Scale and visual production
Authored regional terrain, vegetation instancing, impostors, real device performance campaign (Tiers A/B/C).

Later: multiplayer, persistent world simulation, platform tooling.
