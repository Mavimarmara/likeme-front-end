import { BACKEND_CONFIG } from '@/config';
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

  private async getHeaders(includeAuth = true): Promise<HeadersInit> {
    const headers: HeadersInit = {
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
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || `HTTP error! status: ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>, includeAuth = true, useVersion = false): Promise<T> {
    try {
      let url = `${this.baseUrl}${endpoint}`;
      
      // Se o endpoint já começa com /api, não adicionar versão
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

      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(includeAuth),
      });

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
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: await this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });

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
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: await this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });

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
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: await this.getHeaders(includeAuth),
      });

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

