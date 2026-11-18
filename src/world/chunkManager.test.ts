import { describe, expect, it } from 'vitest';
import { ChunkManager } from './chunkManager';

function makeManager(maxLoads: number) {
  const loaded: string[] = [];
  const unloaded: string[] = [];
  const manager = new ChunkManager<string>({
    chunkSize: 64,
    viewRadius: 2,
    unloadRadius: 3,
    maxLoadsPerUpdate: maxLoads,
    load: (cx, cz) => {
      loaded.push(`${cx},${cz}`);
      return `${cx},${cz}`;
    },
    unload: (_chunk, cx, cz) => {
      unloaded.push(`${cx},${cz}`);
    },
  });
  return { manager, loaded, unloaded };
}

describe('ChunkManager', () => {
  it('respects the per-update load budget and loads nearest first', () => {
    const { manager, loaded } = makeManager(1);
    const stats = manager.update(10, 10);
    expect(stats.loaded).toBe(1);
    expect(loaded[0]).toBe('0,0');
    expect(stats.pending).toBeGreaterThan(0);
  });

  it('eventually loads every chunk within the view radius, and no more', () => {
    const { manager } = makeManager(4);
    let stats = manager.update(0, 0);
    for (let i = 0; i < 100 && stats.pending > 0; i++) stats = manager.update(0, 0);
    expect(stats.pending).toBe(0);
    // Circle of radius 2 on an integer grid = 13 cells.
    expect(manager.residentCount).toBe(13);
  });

  it('unloads chunks that fall outside the unload radius', () => {
    const { manager, unloaded } = makeManager(100);
    manager.update(0, 0);
    const stats = manager.update(64 * 20, 0);
    expect(stats.unloaded).toBe(13);
    expect(unloaded).toContain('0,0');
    expect(manager.has(0, 0)).toBe(false);
  });

  it('disposeAll unloads everything', () => {
    const { manager, unloaded } = makeManager(100);
    manager.update(0, 0);
    manager.disposeAll();
    expect(manager.residentCount).toBe(0);
    expect(unloaded.length).toBe(13);
  });
});
