import type { CategoryName } from '@/types/category';

export type InterestCategory = { id: CategoryName; i18nKey: string };

export const INTEREST_CATEGORIES: InterestCategory[] = [
  { id: 'sleep', i18nKey: 'auth.objectiveSleep' },
  { id: 'activity', i18nKey: 'auth.objectiveMovement' },
  { id: 'connection', i18nKey: 'auth.objectiveRelationship' },
  { id: 'stress', i18nKey: 'auth.objectiveStress' },
  { id: 'smile', i18nKey: 'auth.objectiveOralHealth' },
  { id: 'nutrition', i18nKey: 'auth.objectiveNutrition' },
  { id: 'purpose-vision', i18nKey: 'auth.objectivePurpose' },
  { id: 'self-esteem', i18nKey: 'auth.objectiveSelfEsteem' },
  { id: 'spirituality', i18nKey: 'auth.objectiveSpirituality' },
  { id: 'environment', i18nKey: 'auth.objectiveEnvironment' },
];

type UseInterestCategoriesResult = {
  categories: InterestCategory[];
  isLoading: boolean;
  error: Error | null;
};

export function useInterestCategories(): UseInterestCategoriesResult {
  return {
    categories: INTEREST_CATEGORIES,
    isLoading: false,
    error: null,
  };
}
