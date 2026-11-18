# ARKVOID — Agent and Contributor Operating Rules

Read this file before changing code.

## Product boundary

- Build the playable game. The 3D runtime is the product.
- Do not replace it with a website, portfolio, screenshot gallery, panorama viewer or text-heavy world presentation.
- Keep launch, settings and HUD surfaces subordinate to the running game.
- Never claim that an asset, AI behaviour, simulation, streaming system or backend exists unless the code and evidence support that claim.

## Before editing

1. Inspect the current branch, working tree, package manifest and relevant source files.
2. Read the applicable constitution and architecture decisions.
3. Search for an existing implementation before adding a second one.
4. Define intended scope and measurable acceptance criteria.

## Architecture boundaries

- `src/game` owns world, character, input and simulation code.
- `src/ui` owns DOM-based HUD and accessibility surfaces. UI code must not own gameplay state.
- The render/update loop is imperative and frame-driven. Do not mount React or another component framework in the per-frame path.
- Share domain types at explicit module boundaries. Avoid broad global state.
- World generation must be deterministic for a supplied seed.
- Keep rendering, simulation, persistence and presentation separate.
- Do not introduce a dependency without recording the reason and its runtime/bundle implications.

## Quality rules

- Strict TypeScript; no untyped gameplay payloads.
- Prefer small modules with one clear responsibility.
- Handle missing DOM elements, WebGL failure, storage failure and asset-load failure explicitly.
- Keep input state edge-triggered for one-shot actions and held for continuous actions.
- Clamp frame delta after tab suspension; never let a single long frame destabilise simulation.
- Dispose GPU resources, event listeners, observers and animation loops.
- Add tests for deterministic logic and state transitions.
- Run `npm run verify` before reporting a change as validated.
- Do not commit generated build output, secrets, local saves, private user data or machine-specific files.

## Art and asset provenance

- Every imported asset must have a source URL or supplier, licence/usage terms, author, acquisition date and required attribution recorded in `docs/assets/ASSET_REGISTER.md`.
- Never scrape paid game assets, rip models/textures or use unauthorised extractions.
- Do not reproduce protected characters, worlds, dialogue, faction names, costume designs or distinctive world layouts from existing fiction or games.
- Original procedural blockouts are allowed when clearly labelled as blockouts.

## Definition of done

A change is done only when:
1. Its player-visible behaviour is implemented, not just described.
2. The acceptance criteria can be checked.
3. Typecheck, lint, tests and production build pass, or any failure is transparently recorded.
4. Failure paths and resource cleanup are covered where relevant.
5. Performance impact is understood and measured when it affects the frame loop.
6. Documentation and the progress ledger match the implementation.
7. The PR states what is real, what is placeholder and what remains blocked.

## Current technical reality

The initial milestone is a browser prototype built with Three.js. It uses procedural geometry and local browser storage. It is not an AAA asset set, not a networked persistent world, not a server-authoritative game and not an NPC AI simulation.
