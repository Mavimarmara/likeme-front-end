import { BACKEND_CONFIG, getApiUrl } from '@/config';
import { API_HTTP_REQUEST_TIMEOUT_MS, AUTH_BOOTSTRAP_HTTP_TIMEOUT_MS } from '@/constants';
import storageService from '../auth/storageService';
import { logger } from '@/utils/logger';
import { fetchWithTimeout } from '@/utils/network/fetchWithTimeout';
import type { ApiError } from '@/types/infrastructure';

class ApiClient {
  private baseUrl: string;
  /** `undefined` = cache inválido; valor definido espelha o último token conhecido para o header. */
  private authTokenMemory: string | null | undefined = undefined;
  private authTokenLoadGeneration = 0;
  private refreshBackendTokenPromise: Promise<boolean> | null = null;

  constructor() {
    const base = BACKEND_CONFIG.baseUrl || 'http://localhost:3000';
    this.baseUrl = base.replace(/\/+$/, '');
  }

  invalidateAuthTokenMemoryCache(): void {
    this.authTokenMemory = undefined;
    this.authTokenLoadGeneration += 1;
  }

  private logAuthHeader(method: string, endpoint: string, headers: Record<string, string>) {
    const authorization = headers.Authorization;
    if (authorization) {
      console.log(`[Auth] ${method.toUpperCase()} ${endpoint} usando token: ${authorization}`);
    } else {
      console.log(`[Auth] ${method.toUpperCase()} ${endpoint} sem token no header`);
    }
  }

  private async resolveAuthTokenForRequest(): Promise<string | null> {
    if (this.authTokenMemory !== undefined) {
      return this.authTokenMemory;
    }
    const generationAtRead = this.authTokenLoadGeneration;
    const token = await storageService.getToken();
    if (generationAtRead !== this.authTokenLoadGeneration) {
      return this.resolveAuthTokenForRequest();
    }
    this.authTokenMemory = token;
    return token;
  }

  private async getHeaders(includeAuth = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      accept: '*/*',
    };

    if (includeAuth) {
      const token = await this.resolveAuthTokenForRequest();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async fetchWithRequestTimeout(url: string, init: RequestInit): Promise<Response> {
    return fetchWithTimeout(url, init, API_HTTP_REQUEST_TIMEOUT_MS);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        logger.error('API: falha ao interpretar JSON em resposta OK', {
          status: response.status,
          cause: error,
        });
        throw new Error(
          error instanceof Error ? `Resposta inválida do servidor: ${error.message}` : 'Resposta inválida do servidor.',
        );
      }
    }

    const text = await response.text();
    const trimmed = text.trim();
    if (!trimmed) {
      return undefined as T;
    }
    try {
      return JSON.parse(trimmed) as T;
    } catch (error) {
      logger.error('API: corpo não-JSON em resposta OK', {
        status: response.status,
        preview: trimmed.slice(0, 200),
        cause: error,
      });
      throw new Error(
        error instanceof Error ? `Resposta inválida do servidor: ${error.message}` : 'Resposta inválida do servidor.',
      );
    }
  }

  private async performRefreshBackendToken(): Promise<boolean> {
    try {
      const currentToken = await storageService.getToken();
      if (!currentToken) {
        return false;
      }

      const response = await fetchWithTimeout(
        getApiUrl('/api/auth/token'),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
        },
        AUTH_BOOTSTRAP_HTTP_TIMEOUT_MS,
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json().catch(() => null);
      const newToken = data?.data?.token || data?.token || data?.data?.accessToken || data?.accessToken;

      if (!newToken) {
        return false;
      }

      console.log('[Auth] tokenId recebido:', newToken);

      await storageService.setToken(newToken);
      this.authTokenMemory = newToken;
      return true;
    } catch (error) {
      logger.error('Erro ao tentar obter token do backend:', error);
      return false;
    }
  }

  private refreshBackendToken(): Promise<boolean> {
    if (!this.refreshBackendTokenPromise) {
      this.refreshBackendTokenPromise = this.performRefreshBackendToken().finally(() => {
        this.refreshBackendTokenPromise = null;
      });
    }
    return this.refreshBackendTokenPromise;
  }

  private async requestWithRefresh(execute: () => Promise<Response>, includeAuth: boolean): Promise<Response> {
    let response = await execute();

    if (includeAuth && response.status === 401) {
      this.invalidateAuthTokenMemoryCache();
      const refreshed = await this.refreshBackendToken();

      if (refreshed) {
        response = await execute();
      }

      if (response.status === 401) {
        await storageService.removeToken();
        this.authTokenMemory = null;
      }
    }

    return response;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, includeAuth = true, useVersion = false): Promise<T> {
    try {
      let url = `${this.baseUrl}${endpoint}`;

      if (useVersion && !endpoint.startsWith('/api')) {
        url = `${this.baseUrl}/api/v1${endpoint}`;
      }

      if (params) {
        const queryString = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>),
        ).toString();

        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const execute = async () => {
        const headers = await this.getHeaders(includeAuth);
        this.logAuthHeader('GET', url, headers);
        return this.fetchWithRequestTimeout(url, {
          method: 'GET',
          headers,
        });
      };

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('API GET error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    try {
      const execute = async () => {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders(includeAuth);
        this.logAuthHeader('POST', url, headers);
        return this.fetchWithRequestTimeout(url, {
          method: 'POST',
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
      };

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('API POST error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async put<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    try {
      const execute = async () => {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders(includeAuth);
        this.logAuthHeader('PUT', url, headers);
        return this.fetchWithRequestTimeout(url, {
          method: 'PUT',
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
      };

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('API PUT error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async patch<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    try {
      const execute = async () => {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders(includeAuth);
        this.logAuthHeader('PATCH', url, headers);
        return this.fetchWithRequestTimeout(url, {
          method: 'PATCH',
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
      };

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('API PATCH error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async delete<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    try {
      const execute = async () => {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders(includeAuth);
        this.logAuthHeader('DELETE', url, headers);
        return this.fetchWithRequestTimeout(url, {
          method: 'DELETE',
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
      };

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('API DELETE error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }
}

const apiClient = new ApiClient();

export function invalidateApiClientAuthTokenMemoryCache(): void {
  apiClient.invalidateAuthTokenMemoryCache();
}

export default apiClient;
