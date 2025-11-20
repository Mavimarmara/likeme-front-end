type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

interface Logger {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const isDevelopment = __DEV__;

const createLogger = (level: LogLevel): Logger[LogLevel] => {
  return (...args: any[]) => {
    if (isDevelopment) {
      console[level](...args);
    }
  };
};

export const logger: Logger = {
  log: createLogger('log'),
  error: createLogger('error'),
  warn: createLogger('warn'),
  info: createLogger('info'),
  debug: createLogger('debug'),
};

