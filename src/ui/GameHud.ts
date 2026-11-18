import type { GameAction, InputManager, VirtualControl } from '../game/input/InputManager';
import type { ProgressionSnapshot } from '../game/systems/ProgressionSystem';

export interface HudState {
  progression: ProgressionSnapshot;
  objectiveTitle: string;
  objectiveCopy: string;
  fieldNote: string;
  fps: number;
}

export class GameHud {
  private readonly loading = document.getElementById('loading-screen');
  private readonly errorPanel = document.getElementById('fatal-error');
  private readonly errorCopy = document.getElementById('fatal-error-copy');
  private readonly rankName = document.getElementById('rank-name');
  private readonly qiValue = document.getElementById('qi-value');
  private readonly qiProgress = document.getElementById('qi-progress');
  private readonly shardValue = document.getElementById('shard-value');
  private readonly objectiveTitle = document.getElementById('objective-title');
  private readonly objectiveCopy = document.getElementById('objective-copy');
  private readonly fieldNote = document.getElementById('field-note');
  private readonly interactionPrompt = document.getElementById('interaction-prompt');
  private readonly toastElement = document.getElementById('toast');
  private readonly fpsReadout = document.getElementById('fps-readout');
  private readonly runtimeStatus = document.getElementById('runtime-status');
  private toastTimer: number | undefined;

  constructor(private readonly input: InputManager) {
    this.bindControls();
  }

  showReady(): void {
    this.loading?.classList.add('is-hidden');
    this.setStatus('WORLD READY');
  }

  showError(message: string): void {
    this.loading?.classList.add('is-hidden');
    if (this.errorPanel) this.errorPanel.hidden = false;
    if (this.errorCopy) this.errorCopy.textContent = message;
    this.setStatus('RUNTIME ERROR');
  }

  render(state: HudState): void {
    if (this.rankName) this.rankName.textContent = state.progression.rankName;
    if (this.qiValue) {
      this.qiValue.textContent = `${state.progression.qi} / ${state.progression.nextThreshold}`;
    }
    if (this.qiProgress) {
      (this.qiProgress as HTMLElement).style.width = `${state.progression.progress * 100}%`;
    }
    if (this.shardValue) this.shardValue.textContent = String(state.progression.spiritShards);
    if (this.objectiveTitle) this.objectiveTitle.textContent = state.objectiveTitle;
    if (this.objectiveCopy) this.objectiveCopy.textContent = state.objectiveCopy;
    if (this.fieldNote) this.fieldNote.textContent = state.fieldNote;
    if (this.fpsReadout) this.fpsReadout.textContent = `${Math.round(state.fps)} FPS`;
  }

  setStatus(status: string): void {
    if (this.runtimeStatus) this.runtimeStatus.textContent = status;
  }

  setInteractionPrompt(message: string): void {
    if (!this.interactionPrompt) return;
    this.interactionPrompt.textContent = message;
    this.interactionPrompt.classList.toggle('is-visible', message.length > 0);
  }

  notify(message: string): void {
    if (!this.toastElement) return;
    this.toastElement.textContent = message;
    this.toastElement.classList.add('is-visible');
    if (this.toastTimer !== undefined) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toastElement?.classList.remove('is-visible');
    }, 2600);
  }

  dispose(): void {
    if (this.toastTimer !== undefined) window.clearTimeout(this.toastTimer);
  }

  private bindControls(): void {
    document.querySelectorAll<HTMLButtonElement>('[data-control]').forEach((button) => {
      const control = button.dataset.control as VirtualControl | undefined;
      if (!control) return;
      const press = (event: PointerEvent): void => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        this.input.setVirtualControl(control, true);
      };
      const release = (): void => this.input.setVirtualControl(control, false);
      button.addEventListener('pointerdown', press);
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
      button.addEventListener('contextmenu', (event) => event.preventDefault());
    });

    document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
      const action = button.dataset.action as GameAction | undefined;
      if (!action) return;
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        this.input.queueAction(action);
      });
      button.addEventListener('click', (event) => event.preventDefault());
    });
  }
}
