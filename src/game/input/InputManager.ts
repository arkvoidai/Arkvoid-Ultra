export type GameAction = 'jump' | 'interact' | 'attack';
export type VirtualControl = 'forward' | 'backward' | 'left' | 'right' | 'sprint';

export interface InputFrame {
  moveX: number;
  moveZ: number;
  sprint: boolean;
  jumpPressed: boolean;
  interactPressed: boolean;
  attackPressed: boolean;
  lookX: number;
  lookY: number;
}

const CONTROL_KEYS: Record<string, VirtualControl | GameAction> = {
  w: 'forward',
  arrowup: 'forward',
  s: 'backward',
  arrowdown: 'backward',
  a: 'left',
  arrowleft: 'left',
  d: 'right',
  arrowright: 'right',
  shift: 'sprint',
  ' ': 'jump',
  e: 'interact',
  j: 'attack',
};

export class InputManager {
  private readonly heldKeys = new Set<string>();
  private readonly virtualControls = new Set<VirtualControl>();
  private readonly queuedActions = new Set<GameAction>();
  private lookX = 0;
  private lookY = 0;
  private activeLookPointer: number | null = null;
  private lastPointerX = 0;
  private lastPointerY = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.clearHeldInput);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('contextmenu', this.preventContextMenu);
  }

  setVirtualControl(control: VirtualControl, pressed: boolean): void {
    if (pressed) this.virtualControls.add(control);
    else this.virtualControls.delete(control);
  }

  queueAction(action: GameAction): void {
    this.queuedActions.add(action);
  }

  consumeFrame(): InputFrame {
    const key = (value: string): boolean => this.heldKeys.has(value);
    const has = (value: VirtualControl): boolean => this.virtualControls.has(value);
    const moveX =
      Number(key('d') || key('arrowright') || has('right')) -
      Number(key('a') || key('arrowleft') || has('left'));
    const moveZ =
      Number(key('s') || key('arrowdown') || has('backward')) -
      Number(key('w') || key('arrowup') || has('forward'));

    const frame: InputFrame = {
      moveX,
      moveZ,
      sprint: key('shift') || has('sprint'),
      jumpPressed: this.queuedActions.has('jump'),
      interactPressed: this.queuedActions.has('interact'),
      attackPressed: this.queuedActions.has('attack'),
      lookX: this.lookX,
      lookY: this.lookY,
    };

    this.queuedActions.clear();
    this.lookX = 0;
    this.lookY = 0;
    return frame;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.clearHeldInput);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.removeEventListener('contextmenu', this.preventContextMenu);
    this.clearHeldInput();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    const mapping = CONTROL_KEYS[key];
    if (!mapping) return;
    if (key.startsWith('arrow') || key === ' ') event.preventDefault();

    if (mapping === 'jump' || mapping === 'interact' || mapping === 'attack') {
      if (!event.repeat) this.queueAction(mapping);
      return;
    }
    this.heldKeys.add(key);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.heldKeys.delete(event.key.toLowerCase());
  };

  private readonly clearHeldInput = (): void => {
    this.heldKeys.clear();
    this.virtualControls.clear();
    this.activeLookPointer = null;
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    const bounds = this.canvas.getBoundingClientRect();
    if (event.clientX - bounds.left < bounds.width * 0.32) return;
    this.activeLookPointer = event.pointerId;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.canvas.setPointerCapture(event.pointerId);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.activeLookPointer !== event.pointerId) return;
    this.lookX += event.clientX - this.lastPointerX;
    this.lookY += event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (this.activeLookPointer === event.pointerId) this.activeLookPointer = null;
  };

  private readonly preventContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };
}
