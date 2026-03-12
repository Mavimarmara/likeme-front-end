import { useMemo } from 'react';
import { useCategories } from './useCategories';
import { useTranslation } from '@/hooks/i18n';
import { MARKER_NAMES } from '@/constants/markers';
import { NAME_TO_CATEGORY_ID, type CategoryName } from '@/types/category';
import type { CommunityCategory } from '@/types/community';

export function getMarkerIdForCategory(categoryId: string, name: string): CategoryName | null {
  const key = (categoryId || name).toLowerCase().trim().replace(/\s+/g, '-');
  if (NAME_TO_CATEGORY_ID[key]) return NAME_TO_CATEGORY_ID[key];
  const nameKey = name.toLowerCase().trim().replace(/\s+/g, ' ');
  if (NAME_TO_CATEGORY_ID[nameKey]) return NAME_TO_CATEGORY_ID[nameKey];
  return (key in MARKER_NAMES ? key : null) as CategoryName | null;
}

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
