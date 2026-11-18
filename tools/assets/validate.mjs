#!/usr/bin/env node
// Asset gate. Every .glb under public/assets/models must pass:
//   1. Khronos glTF Validator: 0 errors, 0 warnings
//   2. Class budgets from tools/assets/budgets.json (triangles, materials, texture size, joints)
//   3. A provenance row in assets/ASSET_PROVENANCE.md that names the file path
// Fails closed: if GLBs exist but the validation packages are missing, exit non-zero.
// Requires (dev): gltf-validator @gltf-transform/core @gltf-transform/extensions meshoptimizer
// NOT YET EXECUTED: no GLB exists and packages could not be installed during authoring.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';

const root = process.cwd();
const modelsDir = join(root, 'public/assets/models');
const provenancePath = join(root, 'assets/ASSET_PROVENANCE.md');
const budgets = JSON.parse(readFileSync(join(root, 'tools/assets/budgets.json'), 'utf8'));

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (name.toLowerCase().endsWith('.glb')) yield full;
  }
}

const files = [...walk(modelsDir)];
if (files.length === 0) {
  console.log('assets:validate: no .glb files in public/assets/models, nothing to validate.');
  process.exit(0);
}

let validator, core, ext, meshopt;
try {
  validator = (await import('gltf-validator')).default ?? (await import('gltf-validator'));
  core = await import('@gltf-transform/core');
  ext = await import('@gltf-transform/extensions');
  meshopt = await import('meshoptimizer');
} catch (error) {
  console.error('assets:validate: GLB files exist but validation packages are missing:', error.message);
  console.error('Install: npm i -D gltf-validator @gltf-transform/core @gltf-transform/extensions meshoptimizer');
  process.exit(1);
}

const provenance = existsSync(provenancePath) ? readFileSync(provenancePath, 'utf8') : '';
const io = new core.NodeIO()
  .registerExtensions(ext.ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': meshopt.MeshoptDecoder });
await meshopt.MeshoptDecoder.ready;

let failed = 0;
for (const file of files) {
  const rel = relative(root, file).split(sep).join('/');
  const klass = relative(modelsDir, file).split(sep)[0];
  const budget = budgets[klass] ?? budgets.default;
  const problems = [];

  const bytes = new Uint8Array(readFileSync(file));
  const report = await validator.validateBytes(bytes, { uri: basename(file) });
  if (report.issues.numErrors > 0) problems.push(`validator: ${report.issues.numErrors} error(s)`);
  if (report.issues.numWarnings > 0) problems.push(`validator: ${report.issues.numWarnings} warning(s)`);

  const doc = await io.read(file);
  const root3 = doc.getRoot();
  let triangles = 0;
  for (const mesh of root3.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const mode = prim.getMode();
      const idx = prim.getIndices();
      const count = idx ? idx.getCount() : (prim.getAttribute('POSITION')?.getCount() ?? 0);
      if (mode === 4) triangles += count / 3;
    }
  }
  const materials = root3.listMaterials().length;
  const joints = root3.listSkins().reduce((n, s) => n + s.listJoints().length, 0);
  let maxTex = 0;
  for (const tex of root3.listTextures()) {
    const size = tex.getSize();
    if (size) maxTex = Math.max(maxTex, size[0], size[1]);
  }
  if (triangles > budget.maxTriangles) problems.push(`triangles ${triangles} > ${budget.maxTriangles}`);
  if (materials > budget.maxMaterials) problems.push(`materials ${materials} > ${budget.maxMaterials}`);
  if (maxTex > budget.maxTexturePx) problems.push(`texture ${maxTex}px > ${budget.maxTexturePx}px`);
  if (joints > budget.maxJoints) problems.push(`joints ${joints} > ${budget.maxJoints}`);
  if (!provenance.includes(rel)) problems.push('no provenance row in assets/ASSET_PROVENANCE.md');

  if (problems.length) {
    failed++;
    console.error(`FAIL ${rel} [${klass}]\n  - ${problems.join('\n  - ')}`);
  } else {
    console.log(`PASS ${rel} [${klass}] tris=${triangles} mats=${materials} joints=${joints} maxTex=${maxTex}`);
  }
}
if (failed > 0) {
  console.error(`assets:validate: ${failed} of ${files.length} file(s) failed.`);
  process.exit(1);
}
console.log(`assets:validate: ${files.length} file(s) passed.`);
