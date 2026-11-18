import type { Aabb } from '../physics/collision';

export interface Structure {
  readonly id: string;
  readonly kind: 'platform' | 'step' | 'pillar' | 'wall';
  readonly bounds: Aabb;
}

function box(
  cx: number,
  cz: number,
  sx: number,
  sz: number,
  baseY: number,
  height: number,
): Aabb {
  return {
    minX: cx - sx / 2,
    maxX: cx + sx / 2,
    minZ: cz - sz / 2,
    maxZ: cz + sz / 2,
    minY: baseY,
    maxY: baseY + height,
  };
}

/**
 * Blockout "sect courtyard" on the flat plaza. Placeholder geometry with real
 * colliders: stepped platform, four pillars, two wall segments.
 * `groundY` must equal the plaza height.
 */
export function createCourtyard(groundY: number): readonly Structure[] {
  const z = -14;
  return [
    { id: 'step-1', kind: 'step', bounds: box(0, z + 8.5, 10, 2, groundY, 0.4) },
    { id: 'step-2', kind: 'step', bounds: box(0, z + 6.5, 10, 2, groundY, 0.8) },
    { id: 'platform', kind: 'platform', bounds: box(0, z, 12, 12, groundY, 1.2) },
    { id: 'pillar-nw', kind: 'pillar', bounds: box(-5.5, z - 5.5, 1, 1, groundY + 1.2, 6) },
    { id: 'pillar-ne', kind: 'pillar', bounds: box(5.5, z - 5.5, 1, 1, groundY + 1.2, 6) },
    { id: 'pillar-sw', kind: 'pillar', bounds: box(-5.5, z + 5.5, 1, 1, groundY + 1.2, 6) },
    { id: 'pillar-se', kind: 'pillar', bounds: box(5.5, z + 5.5, 1, 1, groundY + 1.2, 6) },
    { id: 'wall-west', kind: 'wall', bounds: box(-14, z - 2, 1, 14, groundY, 4) },
    { id: 'wall-east', kind: 'wall', bounds: box(14, z - 2, 1, 14, groundY, 4) },
  ];
}
