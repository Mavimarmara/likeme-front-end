import apiClient from '@/services/infrastructure/apiClient';
import type { ApiResponse } from '@/types/infrastructure';
import type { PublicUser } from '@/types/user/publicUser';
import { logger } from '@/utils/logger';

type PublicUserApiResponse = ApiResponse<PublicUser>;

const EMPTY_PUBLIC_USER: PublicUser = {
  name: 'Usuário',
  username: null,
  avatar: null,
};

class PublicUserService {
  async getPublicUser(userId: string): Promise<PublicUser> {
    const id = userId.trim();
    if (!id) {
      return EMPTY_PUBLIC_USER;
    }

    try {
      const response = await apiClient.get<PublicUserApiResponse>('/api/users/public', { userId: id }, true, false);

      if (!response.success || !response.data) {
        logger.warn('Resposta inválida ao buscar usuário público', { userId: id });
        return EMPTY_PUBLIC_USER;
      }

      return {
        name: response.data.name?.trim() || 'Usuário',
        username: response.data.username?.trim() || null,
        avatar: response.data.avatar?.trim() || null,
      };
    } catch (error) {
      logger.error('Erro ao buscar usuário público', { userId: id, error });
      throw error;
    }
  }
}

export default new PublicUserService();
