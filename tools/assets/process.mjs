#!/usr/bin/env node
// Runs the configured glTF Transform steps over assets/source/**/*.glb and writes
// results to public/assets/models/**. Requires: npm i -D @gltf-transform/cli
// NOT YET EXECUTED: no source GLB exists and packages could not be installed during authoring.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = process.cwd();
const cfg = JSON.parse(readFileSync(join(root, 'tools/assets/pipeline.json'), 'utf8'));

function* walk(dir) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (name.toLowerCase().endsWith('.glb')) yield full;
  }
}

const inputs = [...walk(join(root, cfg.inputDir))];
if (inputs.length === 0) {
  console.log(`No source GLB files under ${cfg.inputDir}; nothing to process.`);
  process.exit(0);
}

for (const input of inputs) {
  const rel = relative(join(root, cfg.inputDir), input);
  const output = join(root, cfg.outputDir, rel);
  mkdirSync(dirname(output), { recursive: true });
  let current = input;
  for (const step of cfg.steps) {
    const args = step.args.map((a) => a.replace('{in}', current).replace('{out}', output));
    console.log(`[${step.name}] ${rel}`);
    execFileSync('npx', ['--no-install', step.command, ...args], { stdio: 'inherit' });
    current = output;
  }
}
console.log(`Processed ${inputs.length} file(s). Now run: npm run assets:validate`);
