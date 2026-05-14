import { useMemo } from 'react';
import { useCategories } from './useCategories';
import { useTranslation } from '@/hooks/i18n';
import { getMarkerIdForCategory } from './markerId';
import type { CommunityCategory } from '@/types/community';

export interface UseCategoryDisplayLabelOptions {
  /** Se não informado, o hook usa useCategories() internamente. */
  categories?: CommunityCategory[];
}

export interface UseCategoryDisplayLabelReturn {
  /** Retorna o nome de exibição da categoria (para botão do filtro, etc.). */
  getCategoryName: (categoryId: string) => string;
}

export function useCategoryDisplayLabel(options: UseCategoryDisplayLabelOptions = {}): UseCategoryDisplayLabelReturn {
  const { categories: categoriesOverride } = options;
  const { categories: categoriesFromHook } = useCategories({ enabled: categoriesOverride == null });
  const { t } = useTranslation();

  const categories = categoriesOverride ?? categoriesFromHook;

  const getCategoryName = useMemo(() => {
    return (categoryId: string): string => {
      const cat = categories.find((c) => String(c.categoryId) === String(categoryId));
      const name = cat?.name ?? '';
      const markerId = getMarkerIdForCategory(categoryId, name);
      if (markerId) return t(`filterCategory.categories.${markerId.replace(/-/g, '_')}`);
      return cat?.name ?? categoryId;
    };
  }, [categories, t]);

  return { getCategoryName };
}
