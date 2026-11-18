import * as THREE from 'three';
import type { WorldConfig } from '../config/gameConfig';
import type { HeightFn } from './heightfield';

const NORMAL_EPSILON = 0.5;

// Placeholder palette (blockout; real regional palettes come from art direction).
const WATERLINE = new THREE.Color(0xb7a98a);
const GRASS = new THREE.Color(0x5f7f47);
const ROCK = new THREE.Color(0x77736c);
const SNOW = new THREE.Color(0xe6eaee);
const PLAZA = new THREE.Color(0x8b8577);

const scratch = new THREE.Color();

/**
 * Builds one terrain chunk in world coordinates. Normals come from the
 * heightfield (central differences), so they match across chunk borders.
 */
export function buildTerrainChunk(
  cx: number,
  cz: number,
  cfg: WorldConfig,
  height: HeightFn,
  material: THREE.Material,
): THREE.Mesh {
  const segs = cfg.chunkSegments;
  const verts = segs + 1;
  const step = cfg.chunkSize / segs;
  const originX = cx * cfg.chunkSize;
  const originZ = cz * cfg.chunkSize;

  const positions = new Float32Array(verts * verts * 3);
  const normals = new Float32Array(verts * verts * 3);
  const colors = new Float32Array(verts * verts * 3);

  let v = 0;
  for (let j = 0; j < verts; j++) {
    for (let i = 0; i < verts; i++) {
      const x = originX + i * step;
      const z = originZ + j * step;
      const y = height(x, z);
      positions[v] = x;
      positions[v + 1] = y;
      positions[v + 2] = z;

      const nx = height(x - NORMAL_EPSILON, z) - height(x + NORMAL_EPSILON, z);
      const nz = height(x, z - NORMAL_EPSILON) - height(x, z + NORMAL_EPSILON);
      const ny = 2 * NORMAL_EPSILON;
      const nl = Math.hypot(nx, ny, nz);
      normals[v] = nx / nl;
      normals[v + 1] = ny / nl;
      normals[v + 2] = nz / nl;

      const slope = 1 - ny / nl;
      if (Math.hypot(x, z) < cfg.plazaRadius) scratch.copy(PLAZA);
      else if (y < 0.5) scratch.copy(WATERLINE);
      else if (y > cfg.heightScale * 0.75) scratch.copy(SNOW);
      else if (slope > 0.22) scratch.copy(ROCK);
      else scratch.copy(GRASS);
      // Subtle per-vertex variation to break up flat shading.
      const tint = 0.94 + 0.12 * (((i * 7 + j * 13 + cx * 3 + cz * 5) & 7) / 7);
      colors[v] = scratch.r * tint;
      colors[v + 1] = scratch.g * tint;
      colors[v + 2] = scratch.b * tint;
      v += 3;
    }
  }

  const indices = new Uint32Array(segs * segs * 6);
  let k = 0;
  for (let j = 0; j < segs; j++) {
    for (let i = 0; i < segs; i++) {
      const a = j * verts + i;
      const b = a + 1;
      const c = a + verts;
      const d = c + 1;
      indices[k++] = a;
      indices[k++] = c;
      indices[k++] = b;
      indices[k++] = b;
      indices[k++] = c;
      indices[k++] = d;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.name = `terrain-${cx}-${cz}`;
  return mesh;
}
