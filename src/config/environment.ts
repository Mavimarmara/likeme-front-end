// Helper para obter variável de ambiente com múltiplas estratégias de fallback
const getEnvVar = (key: string, defaultValue?: string): string => {
  // Estratégia 1: process.env (substituído pelo Metro bundler durante o build)
  // Esta é a estratégia PRINCIPAL e mais segura - funciona durante a inicialização
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }

  // Estratégia 2: Tenta Constants.expoConfig.extra.env (disponível em runtime)
  // Isso funciona quando as variáveis são injetadas pelo app.config.js
  try {
    const Constants = require('expo-constants').default;
    if (Constants?.expoConfig?.extra?.env?.[key]) {
      return Constants.expoConfig.extra.env[key];
    }
    // Fallback para acesso direto ao extra
    if (Constants?.expoConfig?.extra?.[key]) {
      return Constants.expoConfig.extra[key];
    }
  } catch (error) {
    // Silenciosamente ignora erros se Constants não estiver disponível
  }

  // Log de debug quando não encontra (apenas para variáveis críticas sem default)
  if (!defaultValue || defaultValue.includes('your-')) {
    // Usa console.warn apenas se console estiver disponível
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[ENV] ⚠️ Variável ${key} não encontrada. Usando default: ${defaultValue || 'vazio'}`);
    }
  }

  return defaultValue || '';
};

// Função helper para acessar Constants depois da inicialização (quando necessário)
// Esta função pode ser usada em runtime quando o Constants já estiver disponível
export const getEnvVarFromConstants = (key: string): string | undefined => {
  try {
    const Constants = require('expo-constants').default;

    // Estratégia 2: Constants.expoConfig.extra.env (para desenvolvimento e builds)
    if (Constants?.expoConfig?.extra?.env?.[key]) {
      return Constants.expoConfig.extra.env[key];
    }

    // Estratégia 3: Constants.manifest.extra.env (para builds nativos antigos)
    if ((Constants as any)?.manifest?.extra?.env?.[key]) {
      return (Constants as any).manifest.extra.env[key];
    }

    // Estratégia 4: Constants.manifest2?.extra?.env (para builds nativos mais recentes)
    if ((Constants as any)?.manifest2?.extra?.env?.[key]) {
      return (Constants as any).manifest2.extra.env[key];
    }

    // Estratégia 5: Acesso direto ao extra (sem .env)
    if (Constants?.expoConfig?.extra?.[key]) {
      return Constants.expoConfig.extra[key];
    }
  } catch (error) {
    // Silenciosamente ignora erros
  }

  return undefined;
};

export const AUTH0_CONFIG = {
  domain: getEnvVar('EXPO_PUBLIC_AUTH0_DOMAIN', 'your-auth0-domain.auth0.com'),
  clientId: getEnvVar('EXPO_PUBLIC_AUTH0_CLIENT_ID', 'your-auth0-client-id'),
  audience: getEnvVar('EXPO_PUBLIC_AUTH0_AUDIENCE', 'your-api-identifier'),
};

export const BACKEND_CONFIG = {
  baseUrl: getEnvVar('EXPO_PUBLIC_BACKEND_URL', 'https://likeme-back-end-one.vercel.app/'),
  apiVersion: 'v1',
};

export const AUTH_CONFIG = {
  useAuthProxy: getEnvVar('EXPO_PUBLIC_USE_AUTH_PROXY', 'true') !== 'false',
  scheme: getEnvVar('EXPO_PUBLIC_AUTH_SCHEME', 'likeme'),
  proxyUrl: getEnvVar('EXPO_PUBLIC_AUTH_PROXY_URL'),
  projectNameForProxy: getEnvVar('EXPO_PUBLIC_AUTH_PROXY_PROJECT'),
  redirectPath: getEnvVar('EXPO_PUBLIC_AUTH_REDIRECT_PATH', 'auth'),
};

export const getApiUrl = (endpoint: string) => {
  const base = (BACKEND_CONFIG.baseUrl || '').replace(/\/+$/, '');
  if (endpoint.startsWith('/api')) {
    return `${base}${endpoint}`;
  }
  return `${base}/api/${BACKEND_CONFIG.apiVersion}${endpoint}`;
};
