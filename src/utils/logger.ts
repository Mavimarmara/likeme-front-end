import { Platform } from 'react-native';

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

interface Logger {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const LOGGER_ON_DEVICE_ENV = 'EXPO_PUBLIC_LOGGER_ON_DEVICE';

function isLikelyEmulatorOrSimulator(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- evitar ciclo de import na arranque
    const Constants = require('expo-constants').default as { deviceName?: string | null };
    const name = (Constants.deviceName ?? '').toLowerCase();
    if (
      name.includes('simulator') ||
      name.includes('emulator') ||
      name.includes('sdk_gphone') ||
      name.includes('google_sdk')
    ) {
      return true;
    }
  } catch {
    return false;
  }
  if (Platform.OS === 'android') {
    const fingerprint = String((Platform.constants as { Fingerprint?: string })?.Fingerprint ?? '').toLowerCase();
    const model = String((Platform.constants as { Model?: string })?.Model ?? '').toLowerCase();
    if (fingerprint.includes('generic') || fingerprint.includes('emulator') || model.includes('emulator')) {
      return true;
    }
  }
  return false;
}

function shouldEmitLoggerOutput(): boolean {
  if (!__DEV__) {
    return false;
  }
  if (process.env[LOGGER_ON_DEVICE_ENV] === 'true') {
    return true;
  }
  return isLikelyEmulatorOrSimulator();
}

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
    if (!shouldEmitLoggerOutput()) {
      return;
    }
    const sanitizedArgs = sanitizeLogArgs(args);
    console[level](...sanitizedArgs);
  };
};

export const logger: Logger = {
  log: createLogger('log'),
  error: createLogger('error'),
  warn: createLogger('warn'),
  info: createLogger('info'),
  debug: createLogger('debug'),
};
