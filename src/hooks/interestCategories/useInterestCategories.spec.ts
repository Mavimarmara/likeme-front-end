import { useInterestCategories, INTEREST_CATEGORIES } from './useInterestCategories';

describe('useInterestCategories', () => {
  it('expõe categorias de interesse estáticas', () => {
    const { categories, isLoading, error } = useInterestCategories();

    expect(categories).toEqual(INTEREST_CATEGORIES);
    expect(categories).toHaveLength(10);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it('inclui ids canônicos esperados', () => {
    const ids = INTEREST_CATEGORIES.map((category) => category.id);

    expect(ids).toEqual([
      'sleep',
      'activity',
      'connection',
      'stress',
      'smile',
      'nutrition',
      'purpose-vision',
      'self-esteem',
      'spirituality',
      'environment',
    ]);
  });
});
