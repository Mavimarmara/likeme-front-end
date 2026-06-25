import apiClient from '../infrastructure/apiClient';
import categoryService from '../category/categoryService';
import { categoryApiNameToCategoryId, type CategoryName } from '@/types/category';
import type { MyPersonCategoriesResponse } from '@/types/personCategory';
import { logger } from '@/utils/logger';

class PersonCategoryService {
  private readonly myCategoriesEndpoint = '/api/person-categories/me/categories';

  private async buildCategoryKeyToApiIdMap(): Promise<Map<string, string>> {
    const categories = await categoryService.listCategories();
    const categoryKeyToApiId = new Map<string, string>();

    for (const category of categories) {
      const categoryId = categoryApiNameToCategoryId(category.name);
      if (!categoryId) {
        logger.warn('[personCategoryService] Categoria da API sem id de interesse', { name: category.name });
        continue;
      }
      categoryKeyToApiId.set(categoryId, category.categoryId);
    }

    return categoryKeyToApiId;
  }

  private categoryIdsToApiIds(categoryIds: CategoryName[], categoryKeyToApiId: Map<string, string>): string[] {
    const apiCategoryIds: string[] = [];
    const missingCategoryIds: CategoryName[] = [];

    for (const categoryId of categoryIds) {
      const apiCategoryId = categoryKeyToApiId.get(categoryId);
      if (!apiCategoryId) {
        missingCategoryIds.push(categoryId);
        continue;
      }
      apiCategoryIds.push(apiCategoryId);
    }

    if (missingCategoryIds.length > 0) {
      throw new Error(`Categorias sem correspondência no catálogo: ${missingCategoryIds.join(', ')}`);
    }

    return apiCategoryIds;
  }

  async getMySelectedCategoryIds(): Promise<CategoryName[]> {
    const response = await apiClient.get<MyPersonCategoriesResponse>(this.myCategoriesEndpoint, undefined, true);
    const items = response.data ?? [];

    return items
      .map((item) => categoryApiNameToCategoryId(item.name))
      .filter((categoryId): categoryId is CategoryName => categoryId != null);
  }

  async syncMyCategories(categoryIds: CategoryName[]): Promise<void> {
    const categoryKeyToApiId = await this.buildCategoryKeyToApiIdMap();
    const apiCategoryIds = this.categoryIdsToApiIds(categoryIds, categoryKeyToApiId);

    await apiClient.put(this.myCategoriesEndpoint, { categoryIds: apiCategoryIds }, true);
  }

  async saveMyCategories(categoryIds: CategoryName[]): Promise<void> {
    if (categoryIds.length === 0) {
      return;
    }

    const categoryKeyToApiId = await this.buildCategoryKeyToApiIdMap();
    const apiCategoryIds = this.categoryIdsToApiIds(categoryIds, categoryKeyToApiId);

    if (apiCategoryIds.length === 0) {
      throw new Error('Nenhuma categoria válida para salvar');
    }

    await apiClient.put(this.myCategoriesEndpoint, { categoryIds: apiCategoryIds }, true);
  }
}

export default new PersonCategoryService();
