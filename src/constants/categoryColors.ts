import { MARKER_COLORS, MARKER_GRADIENTS } from './markers';
import { DEFAULT_BACKGROUND_GRADIENT } from './index';
import { CATEGORY_NAMES, type CategoryName } from '@/types/category';

export { CATEGORY_NAMES, type CategoryName };

/** Cores por categoria (mesmas de MARKER_COLORS + abas do marketplace). */
export const CATEGORY_COLORS = {
  ...MARKER_COLORS,
  all: '#D0DCE8',
  products: '#7DD4B8',
  specialists: '#9BB0E8',
} as const;

/** Gradientes por categoria (mesmos de MARKER_GRADIENTS + abas do marketplace). */
export const CATEGORY_GRADIENTS: Record<string, readonly [string, string, ...string[]]> = {
  ...MARKER_GRADIENTS,
  all: DEFAULT_BACKGROUND_GRADIENT,
  products: ['#7DD4B8', '#B8E6D5', '#E0F5EC'] as const,
  specialists: ['#9BB0E8', '#C5D0F0', '#E8ECF8'] as const,
};

export const getCategoryColor = (categoryId: string): string => {
  const normalizedId = categoryId.toLowerCase().replace(/\s+/g, '-') as CategoryName;
  return CATEGORY_COLORS[normalizedId] ?? '#001137';
};

export const getCategoryGradient = (categoryId: string): readonly [string, string, ...string[]] | null => {
  const normalizedId = categoryId.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_GRADIENTS[normalizedId] ?? null;
};

export const hasCategoryGradient = (categoryId: string): boolean => {
  return getCategoryGradient(categoryId) !== null;
};
