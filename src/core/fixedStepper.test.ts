import { describe, expect, it } from 'vitest';
import { FixedStepper } from './fixedStepper';

describe('FixedStepper', () => {
  it('runs one step per step-length of time', () => {
    const s = new FixedStepper(1 / 60, 5);
    expect(s.advance(1 / 60)).toBe(1);
    expect(s.advance(0.5 / 60)).toBe(0);
    expect(s.advance(0.5 / 60)).toBe(1);
  });

  it('clamps long frames to maxSteps', () => {
    const s = new FixedStepper(1 / 60, 5);
    expect(s.advance(10)).toBe(5);
    expect(s.advance(0)).toBe(0);
  });

  it('ignores negative frame times', () => {
    const s = new FixedStepper(1 / 60, 5);
    expect(s.advance(-1)).toBe(0);
  });

  it('rejects invalid configuration', () => {
    expect(() => new FixedStepper(0, 5)).toThrow(RangeError);
    expect(() => new FixedStepper(1 / 60, 0)).toThrow(RangeError);
  });
});
