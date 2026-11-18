# Asset tooling

Status: **written, not executed** (no GLB exists; packages could not be installed where this was authored).

Install once (dev only; pin versions in `package-lock.json` and record them in `docs/research/LICENCE_REGISTER.md`):

```bash
npm i -D @gltf-transform/cli @gltf-transform/core @gltf-transform/extensions gltf-validator meshoptimizer
```

- `npm run assets:process`: optimise `assets/source/**/*.glb` into `public/assets/models/**`.
- `npm run assets:validate`: gate. Validator (0 errors, 0 warnings), class budgets, provenance row.

Add a provenance row to `assets/ASSET_PROVENANCE.md` for every file. The validator matches on the file path.
First run: expect to adjust the API calls in `validate.mjs` to the installed package versions (e.g. the `gltf-validator` import shape).
