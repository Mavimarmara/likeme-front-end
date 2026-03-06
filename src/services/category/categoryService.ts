import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { CommunityCategory } from '@/types/community';

export interface ListCategoriesApiResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: {
    categories?: Array<{ id: string; name: string; createdAt?: string; updatedAt?: string }>;
  };
}

function mapToCommunityCategory(item: { id: string; name: string }): CommunityCategory {
  return {
    categoryId: item.id,
    name: item.name,
  };
}

class CategoryService {
  private readonly categoriesEndpoint = '/api/categories';

  async listCategories(): Promise<CommunityCategory[]> {
    try {
      const response = await apiClient.get<ListCategoriesApiResponse>(this.categoriesEndpoint, undefined, true, false);

      const isSuccess = response.success === true || response.status === 'success';
      if (!isSuccess || !response.data?.categories) {
        return [];
      }

      return response.data.categories.map(mapToCommunityCategory);
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export default new CategoryService();
