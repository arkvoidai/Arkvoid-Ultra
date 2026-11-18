# ARKVOID

**A living cultivation universe.** The people, places and histories of this world should persist beyond a single session.

ARKVOID is an original third-person cultivation action RPG in active foundation development. The game runtime—not a marketing site—is the product.

## Current milestone

The repository contains a browser-first 3D prototype foundation:

- A real Three.js WebGL scene with a height-field valley, distant ridgelines, a lake basin, a sect compound and instanced vegetation.
- A third-person character blockout with keyboard and mobile touch movement.
- Follow camera, camera-look input, sprinting and jumping.
- Qi motes that can be collected, a training effigy that can be struck, and an altar interaction.
- A versioned local save for prototype progression.
- HUD, deterministic logic tests and CI scaffolding.

This is an early playable greybox. The character is procedural placeholder geometry; the world is not streamed; the attendant is not an AI agent; saves are local to the browser. See [the progress ledger](docs/production/PROGRESS_LEDGER.md) for exact status.

## Run locally

Requirements: Node.js 26 LTS and npm.

```bash
npm ci
npm run dev
```

Open the local Vite URL. The game starts directly in the 3D runtime.

## Controls

| Action   | Keyboard                            | Touch                               |
| -------- | ----------------------------------- | ----------------------------------- |
| Move     | WASD / arrow keys                   | Direction pad                       |
| Look     | Drag on the right side of the scene | Drag on the right side of the scene |
| Sprint   | Shift                               | Hold RUN                            |
| Jump     | Space                               | JUMP                                |
| Interact | E                                   | ATTUNE                              |
| Attack   | J                                   | STRIKE                              |

## Engineering commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npm run verify
```

## Project map

- `src/game/`: runtime, input, character, world generation and gameplay systems.
- `src/ui/`: in-game HUD and touch controls only.
- `src/styles/`: runtime presentation.
- `docs/constitution/`: durable product, engineering, art, performance and IP rules.
- `docs/architecture/`: recorded technical decisions.
- `docs/production/`: roadmap and evidence-based progress.
- `docs/assets/`: source and licence register.
- `tests/`: deterministic unit tests.
- `.github/workflows/`: continuous integration.

Start with [AGENTS.md](AGENTS.md), then read the [Product Constitution](docs/constitution/PRODUCT_CONSTITUTION.md). Do not turn the game into a landing page, image gallery or interactive architectural presentation.

A feature is complete only when its implementation exists, its behaviour is testable, relevant performance is measured, and its limitations are documented. A placeholder is always labelled a placeholder.
