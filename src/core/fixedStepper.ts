/**
 * Fixed-timestep accumulator. Call `advance(frameSeconds)` once per rendered
 * frame; it returns how many simulation steps to run. Large frame gaps are
 * clamped to `maxSteps` worth of time (spiral-of-death protection).
 */
export class FixedStepper {
  private accumulator = 0;
  private static readonly EPSILON = 1e-9;

  constructor(
    readonly stepSeconds: number,
    readonly maxSteps: number,
  ) {
    if (stepSeconds <= 0) throw new RangeError('stepSeconds must be > 0');
    if (maxSteps < 1) throw new RangeError('maxSteps must be >= 1');
  }

  advance(frameSeconds: number): number {
    const clamped = Math.min(Math.max(frameSeconds, 0), this.stepSeconds * this.maxSteps);
    this.accumulator += clamped;
    let steps = 0;
    while (this.accumulator + FixedStepper.EPSILON >= this.stepSeconds && steps < this.maxSteps) {
      this.accumulator -= this.stepSeconds;
      steps++;
    }
    if (this.accumulator < 0) this.accumulator = 0;
    return steps;
  }

  /** Interpolation factor in [0,1) for rendering between steps. */
  get alpha(): number {
    return this.accumulator / this.stepSeconds;
  }
}
