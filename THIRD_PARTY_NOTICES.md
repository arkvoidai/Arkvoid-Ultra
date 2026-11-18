# Third-Party Notices

Engineering record, not legal advice. Notices must be regenerated from installed packages (`node_modules/*/LICENSE`) before any public release; licence texts are not reproduced here yet because no package has been installed in the authoring environment.

## Currently in `package.json`
| Package | Licence | Status |
|---|---|---|
| three | MIT | Verified on upstream repo (github.com/mrdoob/three.js). Licence text to be copied from the installed package. Removed at engine port |
| typescript, vite, vitest, eslint, @eslint/js, typescript-eslint, prettier, @types/three, madge | not individually verified | Dev-only, not shipped. Confirm with the licence-checker before release |

## Planned (add the text when installed)
| Package | Licence | Status |
|---|---|---|
| @babylonjs/core, @babylonjs/loaders | Apache-2.0 | Verified on upstream repo. Include LICENSE and any NOTICE |
| @babylonjs/havok | MIT claimed by Babylon docs/forum | **Unverified**; read the package LICENSE |
| meshoptimizer (decoder shipped at runtime) | MIT | Verified |
| navcat | MIT | Verified on repo sidebar; check its dependencies |
| @gltf-transform/*, gltf-validator | MIT / Apache-2.0 | Dev-only, verified on upstream |

## Reference only (no code copied)
RecastNavigation (zlib), CesiumJS (Apache-2.0), PlayCanvas (MIT), Rapier (Apache-2.0).

## Assets
See `assets/ASSET_PROVENANCE.md`. No third-party assets are shipped.

## Modifications to third-party code
None.
