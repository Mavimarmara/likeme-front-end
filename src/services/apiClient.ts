import { BACKEND_CONFIG, getApiUrl } from '@/config';
import storageService from './storageService';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_CONFIG.baseUrl || 'http://localhost:3000';
  }

  private async getHeaders(includeAuth = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };

    if (includeAuth) {
      const token = await storageService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
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
      const error: ApiError = {
        message: errorData.message || `HTTP error! status: ${response.status}`,
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
      const newToken =
        data?.data?.token ||
        data?.token ||
        data?.data?.accessToken ||
        data?.accessToken;

      if (!newToken) {
        return false;
      }

      await storageService.setToken(newToken);
      return true;
    } catch (error) {
      console.error('Erro ao tentar obter token do backend:', error);
      return false;
    }
  }

  private async requestWithRefresh(
    execute: () => Promise<Response>,
    includeAuth: boolean
  ): Promise<Response> {
    let response = await execute();

    if (!includeAuth || response.status !== 401) {
      return response;
    }

    const refreshed = await this.refreshBackendToken();

    if (!refreshed) {
      await storageService.removeToken();
      return response;
    }

    response = await execute();

    if (response.status === 401) {
      await storageService.removeToken();
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
          }, {} as Record<string, string>)
        ).toString();
        
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const execute = async () =>
        fetch(url, {
          method: 'GET',
          headers: await this.getHeaders(includeAuth),
        });

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API GET error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    try {
      const execute = async () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: await this.getHeaders(includeAuth),
          body: data ? JSON.stringify(data) : undefined,
        });

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API POST error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async put<T>(endpoint: string, data?: any, includeAuth = true): Promise<T> {
    try {
      const execute = async () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: await this.getHeaders(includeAuth),
          body: data ? JSON.stringify(data) : undefined,
        });

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API PUT error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<T> {
    try {
      const execute = async () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: await this.getHeaders(includeAuth),
        });

      const response = await this.requestWithRefresh(execute, includeAuth);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API DELETE error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha na comunicação com o servidor');
    }
  }
}

export default new ApiClient();

