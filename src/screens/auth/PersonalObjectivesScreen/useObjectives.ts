export type ObjectiveItem = { id: string; i18nKey: string };

/** Lista fixa de objetivos em português (id usado na persistência). Fallback quando a API falhar. */
export const OBJECTIVES_FALLBACK: ObjectiveItem[] = [
  { id: '1', i18nKey: 'auth.objectiveSleep' },
  { id: '2', i18nKey: 'auth.objectiveMovement' },
  { id: '3', i18nKey: 'auth.objectiveRelationship' },
  { id: '4', i18nKey: 'auth.objectiveStress' },
  { id: '5', i18nKey: 'auth.objectiveOralHealth' },
  { id: '6', i18nKey: 'auth.objectiveNutrition' },
  { id: '7', i18nKey: 'auth.objectivePurpose' },
  { id: '8', i18nKey: 'auth.objectiveSelfEsteem' },
  { id: '9', i18nKey: 'auth.objectiveSpirituality' },
  { id: '10', i18nKey: 'auth.objectiveEnvironment' },
];

type UseObjectivesResult = {
  objectives: ObjectiveItem[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * Retorna a lista de objetivos para a tela.
 * Hoje usa apenas o fallback local. Quando houver API:
 * - useState(objectives) + useEffect com loading, chamar API, em erro setObjectives(OBJECTIVES_FALLBACK).
 * - Manter cache opcional (ex.: AsyncStorage) para lista.
 */
export function useObjectives(): UseObjectivesResult {
  return {
    objectives: OBJECTIVES_FALLBACK,
    isLoading: false,
    error: null,
  };
}
