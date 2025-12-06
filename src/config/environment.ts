import Constants from 'expo-constants';

// Helper para obter variável de ambiente com múltiplas estratégias de fallback
const getEnvVar = (key: string, defaultValue?: string): string => {
  // Estratégia 1: process.env (substituído pelo Metro bundler durante o build)
  if (process.env[key]) {
    return process.env[key] as string;
  }
  
  // Estratégia 2: Constants.expoConfig.extra.env (para desenvolvimento e builds)
  const expoConfigExtra = Constants.expoConfig?.extra?.env;
  if (expoConfigExtra && expoConfigExtra[key]) {
    return expoConfigExtra[key] as string;
  }
  
  // Estratégia 3: Constants.manifest.extra.env (para builds nativos antigos)
  const manifestExtra = (Constants as any).manifest?.extra?.env;
  if (manifestExtra && manifestExtra[key]) {
    return manifestExtra[key] as string;
  }
  
  // Estratégia 4: Constants.manifest2?.extra?.env (para builds nativos mais recentes)
  const manifest2Extra = (Constants as any).manifest2?.extra?.env;
  if (manifest2Extra && manifest2Extra[key]) {
    return manifest2Extra[key] as string;
  }
  
  // Estratégia 5: Acesso direto ao extra (sem .env)
  const directExtra = Constants.expoConfig?.extra as any;
  if (directExtra && directExtra[key]) {
    return directExtra[key] as string;
  }
  
  // Log de debug quando não encontra (apenas para variáveis críticas sem default)
  if (!defaultValue || defaultValue.includes('your-')) {
    console.warn(`[ENV] ⚠️ Variável ${key} não encontrada. Usando default: ${defaultValue || 'vazio'}`);
  }
  
  return defaultValue || '';
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
  useAuthProxy: (getEnvVar('EXPO_PUBLIC_USE_AUTH_PROXY', 'true') !== 'false'),
  scheme: getEnvVar('EXPO_PUBLIC_AUTH_SCHEME', 'likeme'),
  proxyUrl: getEnvVar('EXPO_PUBLIC_AUTH_PROXY_URL'),
  projectNameForProxy: getEnvVar('EXPO_PUBLIC_AUTH_PROXY_PROJECT'),
  redirectPath: getEnvVar('EXPO_PUBLIC_AUTH_REDIRECT_PATH', 'auth'),
};

export const getApiUrl = (endpoint: string) => {
  // Se o endpoint já começa com /api, não adicionar versão
  if (endpoint.startsWith('/api')) {
    return `${BACKEND_CONFIG.baseUrl}${endpoint}`;
  }
  return `${BACKEND_CONFIG.baseUrl}/api/${BACKEND_CONFIG.apiVersion}${endpoint}`;
};
