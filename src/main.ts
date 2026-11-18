import './ui/styles.css';
import { createLogger, installGlobalErrorHandlers } from './core/logger';
import { Game } from './game/game';
import { Overlay } from './ui/hud';

const log = createLogger('boot');

function boot(): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('Missing #app element');
  root.style.position = 'relative';

  const overlay = new Overlay(root, 'ARKVOID');
  installGlobalErrorHandlers((message) => {
    overlay.showFatal(message);
  });

  void (async () => {
    try {
      const game = new Game(root);
      await game.init();
      game.start();
      overlay.hide();
      log.info('Game started');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log.error('Boot failed', error);
      overlay.showFatal(message);
    }
  })();
}

boot();
