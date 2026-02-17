import { type MarkerId } from '@/constants/markers';

export type MarkerItem = { id: MarkerId; i18nKey: string };

export const PERSONAL_MARKERS_FALLBACK: MarkerItem[] = [
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

type UseMarkersResult = {
  markers: MarkerItem[];
  isLoading: boolean;
  error: Error | null;
};

export function useMarkers(): UseMarkersResult {
  return {
    markers: PERSONAL_MARKERS_FALLBACK,
    isLoading: false,
    error: null,
  };
}
