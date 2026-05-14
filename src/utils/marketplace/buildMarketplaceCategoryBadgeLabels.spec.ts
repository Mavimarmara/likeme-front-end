import { describe, expect, it } from '@jest/globals';
import { buildMarketplaceCategoryBadgeLabels } from './buildMarketplaceCategoryBadgeLabels';
import type { CommunityCategory } from '@/types/community';
import type { Product } from '@/types/product';

const categories: CommunityCategory[] = [
  { categoryId: 'c1', name: 'Sono' },
  { categoryId: 'c2', name: 'Estresse' },
];

describe('buildMarketplaceCategoryBadgeLabels', () => {
  it('usa até dois nomes vindos da API em ordem', () => {
    const product = {
      categoryNames: ['Sono', 'Estresse', 'Extra'],
    } as Pick<Product, 'categoryId' | 'categoryIds' | 'categoryNames'>;

    expect(buildMarketplaceCategoryBadgeLabels(product, categories)).toEqual(['Sono', 'Estresse']);
  });

  it('deduplica nomes da API', () => {
    const product = {
      categoryNames: ['Sono', 'Sono', 'Estresse'],
    } as Pick<Product, 'categoryId' | 'categoryIds' | 'categoryNames'>;

    expect(buildMarketplaceCategoryBadgeLabels(product, categories)).toEqual(['Sono', 'Estresse']);
  });

  it('resolve por categoryId e categoryIds quando não há categoryNames', () => {
    const product = {
      categoryId: 'c2',
      categoryIds: ['c1'],
    } as Pick<Product, 'categoryId' | 'categoryIds' | 'categoryNames'>;

    expect(buildMarketplaceCategoryBadgeLabels(product, categories)).toEqual(['Estresse', 'Sono']);
  });
});
