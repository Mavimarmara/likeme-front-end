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

/** Nomes do catálogo `personalObjective` (seed/API) para cada marcador do onboarding. */
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
