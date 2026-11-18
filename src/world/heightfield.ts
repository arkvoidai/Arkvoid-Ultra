import type { WorldConfig } from '../config/gameConfig';
import { lerp, smoothstep } from '../core/math';
import { fbm2 } from './noise';

export type HeightFn = (x: number, z: number) => number;

const OCTAVES = 6;
const SEA_BIAS = 0.35;

/** Pure, deterministic terrain height function. Flat plaza at the origin. */
export function createHeightfield(cfg: WorldConfig): HeightFn {
  return (x, z) => {
    const raw = fbm2(cfg.seed, x * cfg.baseFrequency, z * cfg.baseFrequency, OCTAVES);
    const terrain = (raw - SEA_BIAS) * cfg.heightScale * 2;
    const dist = Math.hypot(x, z);
    const t = smoothstep(cfg.plazaRadius, cfg.plazaRadius + cfg.plazaBlend, dist);
    return lerp(cfg.plazaHeight, terrain, t);
  };
}
