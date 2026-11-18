export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  readonly level: LogLevel;
  readonly scope: string;
  readonly message: string;
  readonly timeMs: number;
  readonly data?: unknown;
}

export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
}

const HISTORY_LIMIT = 200;
const history: LogEntry[] = [];

function record(entry: LogEntry): void {
  history.push(entry);
  if (history.length > HISTORY_LIMIT) history.shift();
  const line = `[${entry.scope}] ${entry.message}`;
  const args: unknown[] = entry.data === undefined ? [line] : [line, entry.data];
  switch (entry.level) {
    case 'debug':
      console.debug(...args);
      break;
    case 'info':
      console.info(...args);
      break;
    case 'warn':
      console.warn(...args);
      break;
    case 'error':
      console.error(...args);
      break;
  }
}

export function createLogger(scope: string): Logger {
  const make =
    (level: LogLevel) =>
    (message: string, data?: unknown): void => {
      record({ level, scope, message, data, timeMs: performance.now() });
    };
  return {
    debug: make('debug'),
    info: make('info'),
    warn: make('warn'),
    error: make('error'),
  };
}

export function getLogHistory(): readonly LogEntry[] {
  return history;
}

/** Installs window-level handlers. `onFatal` receives a readable message. */
export function installGlobalErrorHandlers(onFatal: (message: string) => void): void {
  const log = createLogger('global');
  window.addEventListener('error', (event) => {
    log.error('Uncaught error', event.error ?? event.message);
    onFatal(event.message || 'Unknown error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    log.error('Unhandled promise rejection', event.reason);
    const reason: unknown = event.reason;
    onFatal(reason instanceof Error ? reason.message : 'Unhandled promise rejection');
  });
}
