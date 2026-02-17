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

const VALID_MARKER_IDS = new Set(PERSONAL_MARKERS_FALLBACK.map((m) => m.id));

const OBJECTIVE_NAME_TO_MARKER_ID: Record<string, MarkerId> = {
  'Improve my sleep': 'sleep',
  'Move more': 'activity',
  'Find a comunity': 'connection',
  'Eat better': 'nutrition',
  'Get to know me better': 'purpose-vision',
  'Improve my habits': 'self-esteem',
  'Track my mood': 'spirituality',
  'Find wellbeing programs': 'environment',
};

export function objectiveNameToMarkerId(name: string): string | null {
  const markerId = OBJECTIVE_NAME_TO_MARKER_ID[name];
  if (markerId != null && VALID_MARKER_IDS.has(markerId)) return markerId;
  return null;
}

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
