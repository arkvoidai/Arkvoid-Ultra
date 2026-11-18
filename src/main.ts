import './styles/game.css';
import { GameRuntime } from './game/GameRuntime';
import { InputManager } from './game/input/InputManager';
import { GameHud } from './ui/GameHud';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');

if (!canvas) {
  throw new Error('ARKVOID runtime canvas was not found.');
}

let runtime: GameRuntime | undefined;
let input: InputManager | undefined;

try {
  input = new InputManager(canvas);
  const hud = new GameHud(input);
  runtime = new GameRuntime(canvas, input, hud);
  runtime.start();
} catch (error) {
  input?.dispose();
  console.error('[ARKVOID] Runtime failed to initialise.', error);
  const message =
    error instanceof Error
      ? error.message
      : 'The browser could not create the WebGL rendering context.';
  document.getElementById('loading-screen')?.classList.add('is-hidden');
  const errorPanel = document.getElementById('fatal-error');
  const errorCopy = document.getElementById('fatal-error-copy');
  if (errorPanel) errorPanel.hidden = false;
  if (errorCopy) errorCopy.textContent = message;
}

window.addEventListener('beforeunload', () => runtime?.dispose(), { once: true });
