import { useState, useEffect, useCallback } from 'react';
import categoryService from '@/services/category/categoryService';
import type { CommunityCategory } from '@/types/community';

interface UseCategoriesOptions {
  enabled?: boolean;
}

interface UseCategoriesReturn {
  categories: CommunityCategory[];
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

  return {
    categories,
    loading,
    error,
    refresh: loadCategories,
  };
};
