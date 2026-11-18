import type { PlayerConfig } from '../config/gameConfig';
import { PLAYER } from '../config/gameConfig';
import { approach, clamp } from '../core/math';
import type { Vec3 } from '../core/math';
import type { Aabb } from '../physics/collision';
import { boxSupportHeight, pushOutHorizontal } from '../physics/collision';

export interface PlayerState {
  readonly position: Vec3;
  readonly velocity: Vec3;
  /** Facing angle (radians). 0 faces -Z. */
  yaw: number;
  grounded: boolean;
}

export interface MoveIntent {
  /** -1..1, positive = forward relative to camera. */
  forward: number;
  /** -1..1, positive = right relative to camera. */
  right: number;
  run: boolean;
  jump: boolean;
  cameraYaw: number;
}

export interface PlayerEnvironment {
  terrainHeight(x: number, z: number): number;
  readonly colliders: readonly Aabb[];
}

export function createPlayerState(x: number, y: number, z: number): PlayerState {
  return {
    position: { x, y, z },
    velocity: { x: 0, y: 0, z: 0 },
    yaw: 0,
    grounded: false,
  };
}

function groundHeight(
  state: PlayerState,
  env: PlayerEnvironment,
  cfg: PlayerConfig,
): number {
  const { x, y, z } = state.position;
  const terrain = env.terrainHeight(x, z);
  const support = boxSupportHeight(x, z, y, cfg.radius, cfg.stepHeight, env.colliders);
  return Math.max(terrain, support);
}

/** Advances the player by one fixed step. Allocation-free. */
export function stepPlayer(
  state: PlayerState,
  intent: MoveIntent,
  dt: number,
  env: PlayerEnvironment,
  cfg: PlayerConfig = PLAYER,
): void {
  const { position: pos, velocity: vel } = state;

  // Camera-relative desired direction. Camera at yaw 0 looks toward -Z.
  const sin = Math.sin(intent.cameraYaw);
  const cos = Math.cos(intent.cameraYaw);
  let dirX = -sin * intent.forward + cos * intent.right;
  let dirZ = -cos * intent.forward - sin * intent.right;
  const len = Math.hypot(dirX, dirZ);
  if (len > 1) {
    dirX /= len;
    dirZ /= len;
  }

  const speed = intent.run ? cfg.runSpeed : cfg.walkSpeed;
  const accel = (state.grounded ? cfg.groundAcceleration : cfg.airAcceleration) * dt;
  vel.x = approach(vel.x, dirX * speed, accel);
  vel.z = approach(vel.z, dirZ * speed, accel);

  if (len > 0.01) state.yaw = Math.atan2(-dirX, -dirZ);

  const wasGrounded = state.grounded;
  if (wasGrounded && intent.jump) {
    vel.y = cfg.jumpSpeed;
    state.grounded = false;
  }

  // Horizontal move + collision.
  pos.x += vel.x * dt;
  pos.z += vel.z * dt;
  pushOutHorizontal(pos, cfg.radius, cfg.height, cfg.stepHeight, env.colliders);

  // Vertical move.
  vel.y = clamp(vel.y - cfg.gravity * dt, -cfg.terminalVelocity, cfg.terminalVelocity);
  pos.y += vel.y * dt;

  const ground = groundHeight(state, env, cfg);
  if (pos.y <= ground) {
    pos.y = ground;
    vel.y = 0;
    state.grounded = true;
  } else if (wasGrounded && vel.y <= 0 && !intent.jump && pos.y - ground < cfg.groundSnap) {
    pos.y = ground;
    vel.y = 0;
    state.grounded = true;
  } else {
    state.grounded = false;
  }
}
