import apiClient from '../infrastructure/apiClient';
import categoryService from '../category/categoryService';
import { categoryApiNameToMarkerId } from '@/types/category';
import type { MyPersonCategoriesResponse } from '@/types/personCategory';
import { logger } from '@/utils/logger';

class PersonCategoryService {
  private readonly myCategoriesEndpoint = '/api/person-categories/me/categories';

  private async buildMarkerToCategoryIdMap(): Promise<Map<string, string>> {
    const categories = await categoryService.listCategories();
    const markerToCategoryId = new Map<string, string>();

    for (const category of categories) {
      const markerId = categoryApiNameToMarkerId(category.name);
      if (!markerId) {
        logger.warn('[personCategoryService] Categoria da API sem marcador de interesse', { name: category.name });
        continue;
      }
      markerToCategoryId.set(markerId, category.categoryId);
    }

    return markerToCategoryId;
  }

  private markerIdsToCategoryIds(markerIds: string[], markerToCategoryId: Map<string, string>): string[] {
    const categoryIds: string[] = [];

    for (const markerId of markerIds) {
      const categoryId = markerToCategoryId.get(markerId);
      if (!categoryId) {
        logger.warn('[personCategoryService] Marcador sem categoria no catálogo', { markerId });
        continue;
      }
      categoryIds.push(categoryId);
    }

    return categoryIds;
  }

  async getMySelectedMarkerIds(): Promise<string[]> {
    const response = await apiClient.get<MyPersonCategoriesResponse>(this.myCategoriesEndpoint, undefined, true);
    const items = response.data ?? [];

    return items
      .map((item) => categoryApiNameToMarkerId(item.name))
      .filter((markerId): markerId is string => markerId != null);
  }

  async syncMyCategoriesFromMarkerIds(markerIds: string[]): Promise<void> {
    const markerToCategoryId = await this.buildMarkerToCategoryIdMap();
    const categoryIds = this.markerIdsToCategoryIds(markerIds, markerToCategoryId);

    await apiClient.put(this.myCategoriesEndpoint, { categoryIds }, true);
  }

  async saveMyCategoriesFromMarkerIds(markerIds: string[]): Promise<void> {
    if (markerIds.length === 0) {
      return;
    }

    const markerToCategoryId = await this.buildMarkerToCategoryIdMap();
    const categoryIds = this.markerIdsToCategoryIds(markerIds, markerToCategoryId);

    if (categoryIds.length === 0) {
      throw new Error('Nenhuma categoria válida para salvar');
    }

    await apiClient.put(this.myCategoriesEndpoint, { categoryIds }, true);
  }
}

export default new PersonCategoryService();
