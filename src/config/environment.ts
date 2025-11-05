export const AUTH0_CONFIG = {
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-auth0-domain.auth0.com',
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-auth0-client-id',
  audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'your-api-identifier',
};

export const BACKEND_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  apiVersion: 'v1',
};

export const getApiUrl = (endpoint: string) => {
  // Se o endpoint já começa com /api, não adicionar versão
  if (endpoint.startsWith('/api')) {
    return `${BACKEND_CONFIG.baseUrl}${endpoint}`;
  }
  return `${BACKEND_CONFIG.baseUrl}/api/${BACKEND_CONFIG.apiVersion}${endpoint}`;
};
