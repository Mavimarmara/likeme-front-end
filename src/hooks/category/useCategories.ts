import { useState, useEffect, useCallback, useMemo } from 'react';
import categoryService from '@/services/category/categoryService';
import type { CommunityCategory } from '@/types/community';
import { MARKER_NAMES } from '@/constants/markers';
import { NAME_TO_CATEGORY_ID } from '@/types/category';

/** Retorna o id canônico (marker) da categoria para deduplicação. */
function getCanonicalKey(categoryId: string, name: string): string {
  const key = (categoryId || name).toLowerCase().trim().replace(/\s+/g, '-');
  if (NAME_TO_CATEGORY_ID[key]) return NAME_TO_CATEGORY_ID[key];
  const nameKey = name.toLowerCase().trim().replace(/\s+/g, ' ');
  if (NAME_TO_CATEGORY_ID[nameKey]) return NAME_TO_CATEGORY_ID[nameKey];
  return key in MARKER_NAMES ? key : String(categoryId);
}

export interface UseCategoriesOptions {
  enabled?: boolean;
}

export interface UseCategoriesReturn {
  categories: CommunityCategory[];
  /** Todas as opções de categoria: markers (fallback) + categorias da API, sem duplicar por categoryId */
  allCategoryOptions: CommunityCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const { enabled = true } = options;

  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await categoryService.listCategories();
      setCategories(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadCategories();
  }, [enabled, loadCategories]);

  const allCategoryOptions = useMemo<CommunityCategory[]>(() => {
    const fallback: CommunityCategory[] = Object.entries(MARKER_NAMES).map(([id, name]) => ({
      categoryId: id,
      name,
    }));

    const byCanonicalKey = new Map<string, CommunityCategory>();
    const add = (c: CommunityCategory) => {
      if (!c?.categoryId) return;
      const key = getCanonicalKey(String(c.categoryId), c.name ?? '');
      if (!byCanonicalKey.has(key)) byCanonicalKey.set(key, c);
    };
    categories.forEach(add);
    fallback.forEach((c) => {
      const key = getCanonicalKey(String(c.categoryId), c.name ?? '');
      if (!byCanonicalKey.has(key)) byCanonicalKey.set(key, c);
    });
    return Array.from(byCanonicalKey.values());
  }, [categories]);

  return {
    categories,
    allCategoryOptions,
    loading,
    error,
    refresh: loadCategories,
  };
};
