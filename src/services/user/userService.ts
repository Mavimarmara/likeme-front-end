import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { ApiResponse } from '@/types/infrastructure';

export interface User {
  id: string;
  username?: string | null;
  email?: string;
  name?: string;
  picture?: string;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  personId?: string;
}

export interface GetProfileResponse extends ApiResponse<User> {}

class UserService {
  /**
   * Busca o perfil do usuário autenticado
   */
  async getProfile(): Promise<GetProfileResponse> {
    try {
      const response = await apiClient.get<GetProfileResponse>(
        '/api/auth/profile',
        undefined,
        true,
        false
      );

      logger.debug('User profile response:', {
        success: response.success,
        hasData: !!response.data,
        userId: response.data?.id,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

export default new UserService();

