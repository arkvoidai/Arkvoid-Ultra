import { describe, expect, it } from 'vitest';
import { WORLD } from '../config/gameConfig';
import { hash2 } from './noise';
import { createHeightfield } from './heightfield';

describe('noise', () => {
  it('hash2 is deterministic and in [0,1)', () => {
    expect(hash2(1, 3, 4)).toBe(hash2(1, 3, 4));
    for (let i = 0; i < 200; i++) {
      const v = hash2(7, i, -i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds give different values', () => {
    expect(hash2(1, 5, 5)).not.toBe(hash2(2, 5, 5));
  });
});

describe('heightfield', () => {
  const height = createHeightfield(WORLD);

  it('is deterministic', () => {
    expect(height(123.4, -88.1)).toBe(createHeightfield(WORLD)(123.4, -88.1));
  });

  it('is flat at the plaza', () => {
    expect(height(0, 0)).toBeCloseTo(WORLD.plazaHeight, 6);
    expect(height(WORLD.plazaRadius * 0.9, 0)).toBeCloseTo(WORLD.plazaHeight, 6);
  });

  it('varies away from the plaza and stays finite and bounded', () => {
    let min = Infinity;
    let max = -Infinity;
    for (let x = -800; x <= 800; x += 40) {
      for (let z = -800; z <= 800; z += 40) {
        const h = height(x, z);
        expect(Number.isFinite(h)).toBe(true);
        min = Math.min(min, h);
        max = Math.max(max, h);
      }
    }
    expect(max - min).toBeGreaterThan(5);
    expect(max).toBeLessThanOrEqual(WORLD.heightScale * 2);
    expect(min).toBeGreaterThanOrEqual(-WORLD.heightScale * 2);
  });
});
