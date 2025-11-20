import apiClient from './infrastructure/apiClient';
import { logger } from '@/utils/logger';

export interface AmityAuthTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    userId: string;
  };
  message: string;
}

class AmityService {
  /**
   * Obtém o token de autenticação do Amity (social.plus) para o usuário autenticado.
   * Este token é necessário para usar o Amity SDK no frontend.
   * 
   * @returns Promise com o access token do Amity
   */
  async getAuthToken(): Promise<string> {
    try {
      const response = await apiClient.get<AmityAuthTokenResponse>(
        '/api/auth/amity-token',
        {},
        true, // Requer autenticação
        false // Não usar versão
      );

      if (!response.success || !response.data?.accessToken) {
        throw new Error(response.message || 'Não foi possível obter token do Amity');
      }

      return response.data.accessToken;
    } catch (error) {
      logger.error('Erro ao obter token do Amity:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha ao obter token de autenticação do Amity');
    }
  }
}

export default new AmityService();

