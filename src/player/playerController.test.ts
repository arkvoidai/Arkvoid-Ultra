import { describe, expect, it } from 'vitest';
import { LOOP, PLAYER } from '../config/gameConfig';
import type { Aabb } from '../physics/collision';
import type { MoveIntent, PlayerEnvironment } from './playerController';
import { createPlayerState, stepPlayer } from './playerController';

const DT = LOOP.stepSeconds;
const idle: MoveIntent = { forward: 0, right: 0, run: false, jump: false, cameraYaw: 0 };

function flatEnv(colliders: readonly Aabb[] = []): PlayerEnvironment {
  return { terrainHeight: () => 0, colliders };
}

function run(state: ReturnType<typeof createPlayerState>, intent: MoveIntent, env: PlayerEnvironment, steps: number) {
  for (let i = 0; i < steps; i++) stepPlayer(state, intent, DT, env);
}

describe('stepPlayer', () => {
  it('falls and lands on terrain', () => {
    const state = createPlayerState(0, 5, 0);
    run(state, idle, flatEnv(), 120);
    expect(state.position.y).toBe(0);
    expect(state.grounded).toBe(true);
  });

  it('moves forward (toward -Z) when camera yaw is 0', () => {
    const state = createPlayerState(0, 0, 0);
    run(state, idle, flatEnv(), 2);
    run(state, { ...idle, forward: 1 }, flatEnv(), 60);
    expect(state.position.z).toBeLessThan(-2);
    expect(Math.abs(state.position.x)).toBeLessThan(1e-6);
  });

  it('running is faster than walking', () => {
    const walker = createPlayerState(0, 0, 0);
    const runner = createPlayerState(0, 0, 0);
    run(walker, { ...idle, forward: 1 }, flatEnv(), 120);
    run(runner, { ...idle, forward: 1, run: true }, flatEnv(), 120);
    expect(Math.abs(runner.position.z)).toBeGreaterThan(Math.abs(walker.position.z));
  });

  it('does not exceed speed on diagonals', () => {
    const state = createPlayerState(0, 0, 0);
    run(state, { ...idle, forward: 1, right: 1 }, flatEnv(), 180);
    expect(Math.hypot(state.velocity.x, state.velocity.z)).toBeLessThanOrEqual(PLAYER.walkSpeed + 1e-6);
  });

  it('jumps only from the ground and peaks above start height', () => {
    const state = createPlayerState(0, 0, 0);
    run(state, idle, flatEnv(), 2);
    let peak = 0;
    stepPlayer(state, { ...idle, jump: true }, DT, flatEnv());
    for (let i = 0; i < 90; i++) {
      stepPlayer(state, idle, DT, flatEnv());
      peak = Math.max(peak, state.position.y);
    }
    expect(peak).toBeGreaterThan(1);
    expect(state.grounded).toBe(true);
    // Mid-air jump press does nothing.
    const air = createPlayerState(0, 10, 0);
    stepPlayer(air, { ...idle, jump: true }, DT, flatEnv());
    expect(air.velocity.y).toBeLessThan(0);
  });

  it('is blocked by a wall', () => {
    const wall: Aabb = { minX: -5, maxX: 5, minZ: -6, maxZ: -5, minY: 0, maxY: 4 };
    const state = createPlayerState(0, 0, 0);
    run(state, idle, flatEnv([wall]), 2);
    run(state, { ...idle, forward: 1, run: true }, flatEnv([wall]), 240);
    expect(state.position.z).toBeGreaterThanOrEqual(-5 + PLAYER.radius - 1e-6);
  });

  it('steps up onto a low platform', () => {
    const step: Aabb = { minX: -5, maxX: 5, minZ: -10, maxZ: -3, minY: 0, maxY: 0.4 };
    const state = createPlayerState(0, 0, 0);
    run(state, idle, flatEnv([step]), 2);
    run(state, { ...idle, forward: 1 }, flatEnv([step]), 120);
    expect(state.position.y).toBeCloseTo(0.4, 6);
    expect(state.grounded).toBe(true);
  });

  it('follows sloped terrain downhill without floating', () => {
    const env: PlayerEnvironment = { terrainHeight: (_x, z) => -z * 0.2, colliders: [] };
    const state = createPlayerState(0, 0, 0);
    run(state, idle, env, 2);
    run(state, { ...idle, forward: 1 }, env, 120);
    expect(state.grounded).toBe(true);
    expect(state.position.y).toBeCloseTo(-state.position.z * 0.2, 6);
  });
});
