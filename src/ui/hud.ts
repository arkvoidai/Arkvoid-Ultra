export interface HudStats {
  fps: number;
  frameMs: number;
  drawCalls: number;
  triangles: number;
  residentChunks: number;
  pendingChunks: number;
  x: number;
  y: number;
  z: number;
  grounded: boolean;
  avatarIsPlaceholder: boolean;
  pointerLocked: boolean;
}

/** DOM overlay. Call `update` at a throttled rate (see LOOP.hudIntervalSeconds), never per frame. */
export class Hud {
  private readonly stats: HTMLDivElement;
  private readonly hint: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.stats = document.createElement('div');
    this.stats.className = 'av-hud';
    this.hint = document.createElement('div');
    this.hint.className = 'av-hint';
    parent.append(this.stats, this.hint);
  }

  update(s: HudStats): void {
    this.stats.textContent = [
      `ARKVOID · Stage 01 foundation`,
      `${s.fps.toFixed(0)} fps · ${s.frameMs.toFixed(1)} ms`,
      `draws ${s.drawCalls} · tris ${s.triangles.toLocaleString('en-US')}`,
      `chunks ${s.residentChunks} resident · ${s.pendingChunks} pending`,
      `pos ${s.x.toFixed(1)}, ${s.y.toFixed(1)}, ${s.z.toFixed(1)} · ${s.grounded ? 'grounded' : 'airborne'}`,
      s.avatarIsPlaceholder ? 'avatar: PLACEHOLDER (capsule)' : 'avatar: model',
    ].join('\n');
    this.hint.textContent = s.pointerLocked
      ? 'WASD move · Shift run · Space jump · mouse look · Esc release'
      : 'Click to capture mouse · WASD move · Shift run · Space jump · arrows look';
  }
}

export class Overlay {
  private readonly el: HTMLDivElement;

  constructor(parent: HTMLElement, text: string) {
    this.el = document.createElement('div');
    this.el.className = 'av-overlay';
    this.el.textContent = text;
    parent.append(this.el);
  }

  hide(): void {
    this.el.classList.add('av-hidden');
    window.setTimeout(() => {
      this.el.remove();
    }, 500);
  }

  showFatal(message: string): void {
    this.el.className = 'av-overlay av-fatal';
    this.el.textContent = `ARKVOID failed to start: ${message}`;
    if (!this.el.isConnected) document.body.append(this.el);
  }
}
