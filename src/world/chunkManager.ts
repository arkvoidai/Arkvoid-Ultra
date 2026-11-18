export interface ChunkManagerOptions<T> {
  readonly chunkSize: number;
  readonly viewRadius: number;
  readonly unloadRadius: number;
  readonly maxLoadsPerUpdate: number;
  load(cx: number, cz: number): T;
  unload(chunk: T, cx: number, cz: number): void;
}

export interface ChunkUpdateStats {
  readonly loaded: number;
  readonly unloaded: number;
  readonly resident: number;
  /** Desired chunks not yet loaded (budget-limited). */
  readonly pending: number;
}

interface Resident<T> {
  readonly cx: number;
  readonly cz: number;
  readonly value: T;
}

const keyOf = (cx: number, cz: number): string => `${cx},${cz}`;

/** Streams chunks in/out around a focus point with a per-update load budget. */
export class ChunkManager<T> {
  private readonly chunks = new Map<string, Resident<T>>();

  constructor(private readonly options: ChunkManagerOptions<T>) {}

  get residentCount(): number {
    return this.chunks.size;
  }

  has(cx: number, cz: number): boolean {
    return this.chunks.has(keyOf(cx, cz));
  }

  update(worldX: number, worldZ: number): ChunkUpdateStats {
    const { chunkSize, viewRadius, unloadRadius, maxLoadsPerUpdate } = this.options;
    const ccx = Math.floor(worldX / chunkSize);
    const ccz = Math.floor(worldZ / chunkSize);

    // Unload far chunks first so peak residency stays bounded.
    let unloaded = 0;
    for (const [key, chunk] of this.chunks) {
      if (Math.hypot(chunk.cx - ccx, chunk.cz - ccz) > unloadRadius) {
        this.options.unload(chunk.value, chunk.cx, chunk.cz);
        this.chunks.delete(key);
        unloaded++;
      }
    }

    const missing: { cx: number; cz: number; d: number }[] = [];
    for (let dz = -viewRadius; dz <= viewRadius; dz++) {
      for (let dx = -viewRadius; dx <= viewRadius; dx++) {
        const d = Math.hypot(dx, dz);
        if (d > viewRadius) continue;
        const cx = ccx + dx;
        const cz = ccz + dz;
        if (!this.chunks.has(keyOf(cx, cz))) missing.push({ cx, cz, d });
      }
    }
    missing.sort((a, b) => a.d - b.d);

    let loaded = 0;
    for (const m of missing) {
      if (loaded >= maxLoadsPerUpdate) break;
      this.chunks.set(keyOf(m.cx, m.cz), {
        cx: m.cx,
        cz: m.cz,
        value: this.options.load(m.cx, m.cz),
      });
      loaded++;
    }

    return {
      loaded,
      unloaded,
      resident: this.chunks.size,
      pending: missing.length - loaded,
    };
  }

  disposeAll(): void {
    for (const chunk of this.chunks.values()) {
      this.options.unload(chunk.value, chunk.cx, chunk.cz);
    }
    this.chunks.clear();
  }
}
