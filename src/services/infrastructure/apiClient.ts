import { BACKEND_CONFIG, getApiUrl } from '@/config';
import storageService from '../auth/storageService';
import { logger } from '@/utils/logger';
import type { ApiResponse, ApiError } from '@/types/infrastructure';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_CONFIG.baseUrl || 'http://localhost:3000';
  }

  private logAuthHeader(method: string, endpoint: string, headers: Record<string, string>) {
    const authorization = headers.Authorization;
    if (authorization) {
      console.log(`[Auth] ${method.toUpperCase()} ${endpoint} usando token: ${authorization}`);
    } else {
      console.log(`[Auth] ${method.toUpperCase()} ${endpoint} sem token no header`);
    }
  }

  private async getHeaders(includeAuth = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      accept: '*/*',
    };

    if (includeAuth) {
      const token = await storageService.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const errorData = await response.json().catch(() => ({}));
      // Extrair mensagem de erro do backend (pode estar em errorData.message ou errorData.error)
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  private async refreshBackendToken(): Promise<boolean> {
    try {
      const currentToken = await storageService.getToken();
      if (!currentToken) {
        return false;
      }

      const response = await fetch(getApiUrl('/api/auth/token'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json().catch(() => null);
      const newToken = data?.data?.token || data?.token || data?.data?.accessToken || data?.accessToken;

      if (!newToken) {
        return false;
      }

      if (newToken) {
        console.log('[Auth] tokenId recebido:', newToken);
      } else {
        console.log('[Auth] tokenId não informado na resposta do backend.');
      }

      await storageService.setToken(newToken);
      return true;
    } catch (error) {
      logger.error('Erro ao tentar obter token do backend:', error);
      return false;
    }
  }

  private async requestWithRefresh(execute: () => Promise<Response>, includeAuth: boolean): Promise<Response> {
    // Medida paliativa: sempre tentar renovar o token antes de fazer requisições autenticadas
    if (includeAuth) {
      await this.refreshBackendToken();
    }

    let response = await execute();

    // Se ainda receber 401 após renovação, tentar novamente uma vez
    if (includeAuth && response.status === 401) {
      const refreshed = await this.refreshBackendToken();

      if (refreshed) {
        response = await execute();
      }

      if (response.status === 401) {
        await storageService.removeToken();
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
        return fetch(url, {
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
        return fetch(url, {
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
        return fetch(url, {
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
        return fetch(url, {
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
        return fetch(url, {
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

export default new ApiClient();
