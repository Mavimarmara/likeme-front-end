type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

interface Logger {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const isDevelopment = __DEV__;

// Converte argumentos para formato seguro para logging
// Isso evita que o LogBox tente renderizar objetos Error diretamente
const sanitizeLogArgs = (args: any[]): any[] => {
  return args.map((arg) => {
    if (arg instanceof Error) {
      // Para objetos Error, retorna apenas a mensagem como string
      // O stack trace será capturado automaticamente pelo LogBox se necessário
      const errorMessage = arg.message || 'Erro desconhecido';
      const errorName = arg.name || 'Error';
      return `${errorName}: ${errorMessage}`;
    }
    if (typeof arg === 'object' && arg !== null) {
      // Para objetos, tenta fazer stringify seguro
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    }
    // Para primitivos, retorna como está
    return arg;
  });
};

const createLogger = (level: LogLevel): Logger[LogLevel] => {
  return (...args: any[]) => {
    if (isDevelopment) {
      // Sanitiza os argumentos antes de logar para evitar problemas com LogBox
      const sanitizedArgs = sanitizeLogArgs(args);
      console[level](...sanitizedArgs);
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

