import { describe, expect, it } from 'vitest';
import type { Aabb } from './collision';
import { boxSupportHeight, pushOutHorizontal } from './collision';

const wall: Aabb = { minX: 0, maxX: 1, minZ: -5, maxZ: 5, minY: 0, maxY: 4 };

describe('pushOutHorizontal', () => {
  it('pushes a cylinder out of a wall to exactly radius distance', () => {
    const pos = { x: -0.2, y: 0, z: 0 };
    const pushed = pushOutHorizontal(pos, 0.4, 1.8, 0.6, [wall]);
    expect(pushed).toBe(true);
    expect(pos.x).toBeCloseTo(-0.4, 6);
  });

  it('does nothing when clear of the box', () => {
    const pos = { x: -2, y: 0, z: 0 };
    expect(pushOutHorizontal(pos, 0.4, 1.8, 0.6, [wall])).toBe(false);
    expect(pos.x).toBe(-2);
  });

  it('ignores a box whose top is within step height', () => {
    const low: Aabb = { ...wall, maxY: 0.4 };
    const pos = { x: -0.2, y: 0, z: 0 };
    expect(pushOutHorizontal(pos, 0.4, 1.8, 0.6, [low])).toBe(false);
  });

  it('ejects a centre that is inside the footprint through the nearest face', () => {
    const pos = { x: 0.1, y: 0, z: 0 };
    pushOutHorizontal(pos, 0.4, 1.8, 0.6, [wall]);
    expect(pos.x).toBeCloseTo(-0.4, 6);
  });
});

describe('boxSupportHeight', () => {
  const low: Aabb = { minX: 0, maxX: 2, minZ: 0, maxZ: 2, minY: 0, maxY: 0.4 };
  const high: Aabb = { minX: 0, maxX: 2, minZ: 0, maxZ: 2, minY: 0, maxY: 3 };

  it('returns the top of a reachable box under the player', () => {
    expect(boxSupportHeight(1, 1, 0, 0.4, 0.6, [low])).toBe(0.4);
  });

  it('ignores boxes taller than step height above the feet', () => {
    expect(boxSupportHeight(1, 1, 0, 0.4, 0.6, [high])).toBe(-Infinity);
  });

  it('ignores boxes not under the footprint', () => {
    expect(boxSupportHeight(10, 10, 0, 0.4, 0.6, [low])).toBe(-Infinity);
  });
});
