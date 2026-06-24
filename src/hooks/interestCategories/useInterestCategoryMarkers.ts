import { type MarkerId } from '@/constants/markers';

export type InterestCategoryMarker = { id: MarkerId; i18nKey: string };

export const INTEREST_CATEGORY_MARKERS: InterestCategoryMarker[] = [
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

const VALID_MARKER_IDS = new Set(INTEREST_CATEGORY_MARKERS.map((marker) => marker.id));

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

/** Nomes do catálogo da API para cada marcador de categoria. */
export const MARKER_ID_TO_OBJECTIVE_NAME: Record<MarkerId, string> = {
  sleep: 'Improve my sleep',
  activity: 'Move more',
  connection: 'Find a comunity',
  stress: 'Gain insights on my wellbeing',
  smile: 'Buy health products',
  nutrition: 'Eat better',
  'purpose-vision': 'Get to know me better',
  'self-esteem': 'Improve my habits',
  spirituality: 'Track my mood',
  environment: 'Find wellbeing programs',
};

export function markerIdToObjectiveName(markerId: string): string | null {
  const normalizedId = markerId.toLowerCase().replace(/\s+/g, '-') as MarkerId;
  if (!VALID_MARKER_IDS.has(normalizedId)) return null;
  return MARKER_ID_TO_OBJECTIVE_NAME[normalizedId] ?? null;
}

export function objectiveNameToMarkerId(name: string): string | null {
  const markerId = OBJECTIVE_NAME_TO_MARKER_ID[name];
  if (markerId != null && VALID_MARKER_IDS.has(markerId)) return markerId;
  return null;
}

type UseInterestCategoryMarkersResult = {
  markers: InterestCategoryMarker[];
  isLoading: boolean;
  error: Error | null;
};

export function useInterestCategoryMarkers(): UseInterestCategoryMarkersResult {
  return {
    markers: INTEREST_CATEGORY_MARKERS,
    isLoading: false,
    error: null,
  };
}
