import { describe, expect, it } from 'vitest';
import { ProgressionSystem } from '../src/game/systems/ProgressionSystem';

describe('progression system', () => {
  it('starts at the mortal foundation', () => {
    const progression = new ProgressionSystem();
    expect(progression.snapshot().rankName).toBe('Mortal Foundation');
    expect(progression.snapshot().qi).toBe(0);
  });

  it('advances when Qi reaches the defined threshold', () => {
    const progression = new ProgressionSystem();
    progression.addQi(30);
    expect(progression.snapshot().rankName).toBe('Qi Condensation · First Layer');
    expect(progression.snapshot().progress).toBe(0);
  });

  it('ignores invalid or non-positive rewards', () => {
    const progression = new ProgressionSystem();
    progression.addQi(Number.NaN);
    progression.addQi(-10);
    progression.addSpiritShards(Number.POSITIVE_INFINITY);
    expect(progression.snapshot().qi).toBe(0);
    expect(progression.snapshot().spiritShards).toBe(0);
  });
});
