/** Central tunables. No magic numbers in systems: add them here. */

export interface PlayerConfig {
  readonly walkSpeed: number;
  readonly runSpeed: number;
  readonly jumpSpeed: number;
  readonly gravity: number;
  readonly radius: number;
  readonly height: number;
  readonly groundAcceleration: number;
  readonly airAcceleration: number;
  /** Max step-up onto a collider top, metres. */
  readonly stepHeight: number;
  /** Snap-to-ground distance when walking downhill, metres. */
  readonly groundSnap: number;
  readonly terminalVelocity: number;
}

export interface WorldConfig {
  readonly seed: number;
  readonly chunkSize: number;
  readonly chunkSegments: number;
  readonly viewRadius: number;
  readonly unloadRadius: number;
  readonly maxLoadsPerUpdate: number;
  readonly heightScale: number;
  readonly baseFrequency: number;
  readonly plazaRadius: number;
  readonly plazaBlend: number;
  readonly plazaHeight: number;
}

export interface CameraConfig {
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly distance: number;
  readonly targetHeight: number;
  readonly minPitch: number;
  readonly maxPitch: number;
  readonly mouseSensitivity: number;
  readonly keyLookSpeed: number;
  readonly minClearance: number;
}

export interface LoopConfig {
  readonly stepSeconds: number;
  readonly maxStepsPerFrame: number;
  readonly hudIntervalSeconds: number;
}

export interface RenderConfig {
  readonly fogNear: number;
  readonly fogFar: number;
  readonly skyTop: number;
  readonly skyHorizon: number;
  readonly shadowMapSize: number;
  readonly shadowExtent: number;
  readonly maxPixelRatio: number;
}

export const RENDER: RenderConfig = Object.freeze({
  // Fog hides the streaming edge: nearest unloaded terrain is >= ~128 m away.
  fogNear: 50,
  fogFar: 150,
  skyTop: 0x4f78b5,
  skyHorizon: 0xaebbc9,
  shadowMapSize: 2048,
  shadowExtent: 40,
  maxPixelRatio: 2,
});

export const PLAYER: PlayerConfig = Object.freeze({
  walkSpeed: 4.5,
  runSpeed: 8.5,
  jumpSpeed: 7.5,
  gravity: 22,
  radius: 0.4,
  height: 1.8,
  groundAcceleration: 40,
  airAcceleration: 12,
  stepHeight: 0.6,
  groundSnap: 0.35,
  terminalVelocity: 55,
});

export const WORLD: WorldConfig = Object.freeze({
  seed: 1337,
  chunkSize: 64,
  chunkSegments: 32,
  viewRadius: 3,
  unloadRadius: 4,
  maxLoadsPerUpdate: 1,
  heightScale: 38,
  baseFrequency: 1 / 180,
  plazaRadius: 40,
  plazaBlend: 90,
  plazaHeight: 2,
});

export const CAMERA: CameraConfig = Object.freeze({
  fov: 60,
  near: 0.1,
  far: 1200,
  distance: 6.5,
  targetHeight: 1.5,
  minPitch: -0.35,
  maxPitch: 1.2,
  mouseSensitivity: 0.0022,
  keyLookSpeed: 1.8,
  minClearance: 0.6,
});

export const LOOP: LoopConfig = Object.freeze({
  stepSeconds: 1 / 60,
  maxStepsPerFrame: 5,
  hudIntervalSeconds: 0.25,
});
