import { describe, expect, it } from 'vitest';
import { createSeededRandom } from '../src/game/world/random';
import { clampToWorld, isInsideWorld, terrainHeightAt } from '../src/game/world/terrain';

describe('terrain height field', () => {
  it('returns the same height for the same coordinates', () => {
    expect(terrainHeightAt(12.5, -38)).toBe(terrainHeightAt(12.5, -38));
  });

  it('returns finite heights across the supported world area', () => {
    for (let x = -180; x <= 180; x += 12) {
      for (let z = -180; z <= 180; z += 12) {
        expect(Number.isFinite(terrainHeightAt(x, z))).toBe(true);
      }
    }
  });

  it('keeps player coordinates inside the playable boundary', () => {
    expect(clampToWorld(900, -900)).toEqual({ x: 178, z: -178 });
    expect(isInsideWorld(0, 0)).toBe(true);
    expect(isInsideWorld(180, 0)).toBe(false);
  });
});

describe('seeded random generator', () => {
  it('produces the same sequence for the same seed', () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);
    expect(Array.from({ length: 8 }, first)).toEqual(Array.from({ length: 8 }, second));
  });

  it('produces values in the half-open unit interval', () => {
    const random = createSeededRandom(17);
    for (let index = 0; index < 500; index += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
