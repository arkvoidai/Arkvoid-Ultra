# ARKVOID Engineering Constitution

## Runtime
One application: Vite + strict TypeScript + Three.js, in `src/`. No second app, no framework in the render loop. DOM is used only for HUD/menus and is updated at a throttled rate (default 4 Hz), never per frame.

## Folder boundaries (dependencies point downward only)
```
src/config     tuning constants and typed gameplay/world parameters (no imports)
src/core       logger, fixed-step loop, math helpers (imports config only)
src/physics    collision primitives (pure; imports core types)
src/world      noise, heightfield, chunk manager, structures, terrain meshing
src/player     player simulation (pure, no Three.js)
src/input      keyboard / pointer-lock abstraction
src/assets     asset manifest and loader with failure strategy
src/ui         DOM HUD, loading, fatal-error overlay
src/game       composition root: wires everything, owns the Three.js scene
src/main.ts    bootstrap only
```
Rules: `physics`, `player`, `world/noise`, `world/heightfield`, `world/chunkManager` must not import `three`. This keeps simulation unit-testable and portable to a server later. `npm run check:cycles` must report zero circular dependencies.

## TypeScript
`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. No `any`. No non-null `!` outside tests. Data crossing system boundaries uses exported interfaces.

## Naming
Files: `camelCase.ts`; classes `PascalCase`; constants `UPPER_SNAKE` only for frozen config objects; tests `*.test.ts` beside the module.

## Gameplay rules
All tunables live in `src/config/`. No magic numbers in systems.

## Errors and logging
All logging via `createLogger(scope)`. `console.*` is lint-banned outside `core/logger.ts`. Global `error` / `unhandledrejection` handlers are installed at boot and surface a fatal overlay.

## Asset failure strategy
Load with timeout (default 8 s) and retries (default 2). On final failure: log, record in the failure registry, substitute the declared fallback. Required assets log `error`; optional assets log `warn`. The game must remain playable with all fallbacks.

## Package management
`package-lock.json` committed; CI uses `npm ci`. Node version pinned in `.nvmrc`. New dependencies need an entry in `TECHNOLOGY_DECISIONS.md`.

## Automated checks (`npm run check`)
typecheck, lint, format check, unit tests, cycle check. CI runs `check` and `build` on every push and PR.

## Secrets
No secrets in the repo. `.env*` is gitignored.
