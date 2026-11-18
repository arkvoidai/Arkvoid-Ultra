import { CAMERA } from '../config/gameConfig';

export interface InputSnapshot {
  forward: number;
  right: number;
  run: boolean;
  jump: boolean;
  /** Camera look delta in radians since last snapshot (yaw, pitch). */
  lookYaw: number;
  lookPitch: number;
}

/** Keyboard + pointer-lock mouse. Polled once per rendered frame. */
export class Input {
  private readonly keys = new Set<string>();
  private lookX = 0;
  private lookY = 0;
  private readonly snapshot: InputSnapshot = {
    forward: 0,
    right: 0,
    run: false,
    jump: false,
    lookYaw: 0,
    lookPitch: 0,
  };

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  };
  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };
  private readonly onMouseMove = (e: MouseEvent): void => {
    if (document.pointerLockElement !== this.element) return;
    this.lookX += e.movementX;
    this.lookY += e.movementY;
  };
  private readonly onClick = (): void => {
    if (document.pointerLockElement !== this.element) {
      void this.element.requestPointerLock();
    }
  };
  private readonly onBlur = (): void => {
    this.keys.clear();
  };

  constructor(private readonly element: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('mousemove', this.onMouseMove);
    element.addEventListener('click', this.onClick);
  }

  get pointerLocked(): boolean {
    return document.pointerLockElement === this.element;
  }

  /** Returns a reused object; do not retain across frames. */
  poll(frameSeconds: number): InputSnapshot {
    const k = this.keys;
    const s = this.snapshot;
    s.forward = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    s.right = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    s.run = k.has('ShiftLeft') || k.has('ShiftRight');
    s.jump = k.has('Space');

    const keyYaw = (k.has('ArrowLeft') ? 1 : 0) - (k.has('ArrowRight') ? 1 : 0);
    const keyPitch = (k.has('ArrowUp') ? 1 : 0) - (k.has('ArrowDown') ? 1 : 0);
    s.lookYaw = -this.lookX * CAMERA.mouseSensitivity + keyYaw * CAMERA.keyLookSpeed * frameSeconds;
    // Positive pitch raises the camera (looks down). Mouse down / arrow-down looks down.
    s.lookPitch = this.lookY * CAMERA.mouseSensitivity - keyPitch * CAMERA.keyLookSpeed * frameSeconds;
    this.lookX = 0;
    this.lookY = 0;
    return s;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.element.removeEventListener('click', this.onClick);
  }
}
