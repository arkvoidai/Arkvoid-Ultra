export const WORLD_HALF_EXTENT = 180;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Shared deterministic height function for the rendered field and player ground contact. */
export function terrainHeightAt(x: number, z: number): number {
  const radius = Math.hypot(x * 0.94, z * 0.9);
  const outerRise = Math.pow(smoothstep(48, 178, radius), 1.32) * 34;
  const ridgeField =
    Math.sin(x * 0.018 + Math.cos(z * 0.013) * 1.8) * 2.35 +
    Math.cos(z * 0.022) * 1.55 +
    Math.sin((x + z) * 0.012) * 1.15 +
    Math.sin((x - z) * 0.037) * 0.42;
  const lakeDistance = Math.hypot((x - 62) / 20, (z - 18) / 30);
  const lakeDepression = 8.5 * (1 - smoothstep(0.72, 1.15, lakeDistance));
  return outerRise + ridgeField - lakeDepression;
}

export function isInsideWorld(x: number, z: number, margin = 2): boolean {
  const limit = WORLD_HALF_EXTENT - margin;
  return Math.abs(x) <= limit && Math.abs(z) <= limit;
}

export function clampToWorld(x: number, z: number, margin = 2): { x: number; z: number } {
  const limit = WORLD_HALF_EXTENT - margin;
  return { x: clamp(x, -limit, limit), z: clamp(z, -limit, limit) };
}
