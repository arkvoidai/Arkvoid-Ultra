# ARKVOID Product Constitution

## What ARKVOID is
An original persistent cultivation-fantasy universe. First product: a third-person 3D open-world action RPG, playable in the browser (WebGL via Three.js). Long-term ambition: a persistent embodied world-computing platform. That ambition is earned only after the game is credible.

## What ARKVOID is not
Not a landing page, editorial site, gallery, portfolio, fake-3D CSS scene, or static panorama. The game viewport is the product. Launcher, loading, settings, HUD and in-game menus are supporting UI only.

## Product principles (each is a testable rule)
1. Real 3D geometry. Every visible world surface is a mesh in the scene graph.
2. Real movement. Player position comes from the simulation (`stepPlayer`), never scripted camera paths.
3. Real collision. Anything the player can see as solid must have a collider or be flagged `decorative` in the ledger.
4. Real interactions. A UI control ships only when its handler changes game state.
5. Real data. Progression values come from typed game data; no fabricated stats.
6. Real streaming. World chunks load and unload around the player; resident chunk count is bounded and displayed in the debug HUD.
7. Visual quality comes from asset production and art direction, not polygon counts.
8. Performance is measured on real devices and recorded in the progress ledger.
9. Important player state is persisted server-side with validation (not before the persistence stage; never trust client-only saves for economy or progression).
10. Original IP only. See `INTELLECTUAL_PROPERTY_POLICY.md`.

## Honesty rules
- Never describe a feature as present unless it runs in the build.
- Placeholder content (e.g. the capsule avatar) must be labelled as placeholder in code, HUD and ledger.
- NPC "AI" is not claimed until NPCs have a decision loop with tests.
- Streaming is not claimed unless chunks are loaded incrementally.

## Definition of done (feature level)
- Implemented in the repo, typed, linted, formatted.
- Unit tests for pure logic; manual or automated run of the real game.
- `npm run check` and `npm run build` pass.
- Entry added to `docs/production/PROGRESS_LEDGER.md` with status: `done`, `partial` or `placeholder`.
- Performance budget in `PERFORMANCE_CONSTITUTION.md` not regressed.
