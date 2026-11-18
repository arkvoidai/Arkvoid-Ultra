import type { Vec3 } from '../core/math';
import { clamp } from '../core/math';

export interface Aabb {
  readonly minX: number;
  readonly minY: number;
  readonly minZ: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly maxZ: number;
}

/** Pushes a vertical cylinder (feet at pos.y) out of boxes horizontally. Mutates pos. */
export function pushOutHorizontal(
  pos: Vec3,
  radius: number,
  height: number,
  stepHeight: number,
  boxes: readonly Aabb[],
): boolean {
  let pushed = false;
  for (const box of boxes) {
    // Above the box (can step onto it) or entirely below it: no side collision.
    if (pos.y + height <= box.minY) continue;
    if (pos.y >= box.maxY - stepHeight) continue;

    const cx = clamp(pos.x, box.minX, box.maxX);
    const cz = clamp(pos.z, box.minZ, box.maxZ);
    const dx = pos.x - cx;
    const dz = pos.z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= radius * radius) continue;

    if (d2 > 1e-12) {
      const d = Math.sqrt(d2);
      const push = radius - d;
      pos.x += (dx / d) * push;
      pos.z += (dz / d) * push;
    } else {
      // Centre is inside the box footprint: exit through the nearest face.
      const left = pos.x - box.minX;
      const right = box.maxX - pos.x;
      const back = pos.z - box.minZ;
      const front = box.maxZ - pos.z;
      const min = Math.min(left, right, back, front);
      if (min === left) pos.x = box.minX - radius;
      else if (min === right) pos.x = box.maxX + radius;
      else if (min === back) pos.z = box.minZ - radius;
      else pos.z = box.maxZ + radius;
    }
    pushed = true;
  }
  return pushed;
}

/**
 * Highest walkable box top under the cylinder footprint that is no higher than
 * feetY + stepHeight. Returns -Infinity if none.
 */
export function boxSupportHeight(
  x: number,
  z: number,
  feetY: number,
  radius: number,
  stepHeight: number,
  boxes: readonly Aabb[],
): number {
  let best = -Infinity;
  const r2 = radius * radius;
  for (const box of boxes) {
    if (box.maxY > feetY + stepHeight) continue;
    const dx = x - clamp(x, box.minX, box.maxX);
    const dz = z - clamp(z, box.minZ, box.maxZ);
    if (dx * dx + dz * dz >= r2) continue;
    if (box.maxY > best) best = box.maxY;
  }
  return best;
}
