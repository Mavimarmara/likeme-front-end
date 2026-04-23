/** Soluções que podem ser escolhidas nos filtros. */
export type SolutionFilterId = 'communities' | 'products' | 'professionals' | 'programs' | 'services';

/** Abas de solução da Home. "all" é estado derivado quando nenhum filtro de solução está ativo. */
export type SolutionTab = 'all' | Exclude<SolutionFilterId, 'services'>;

/** Opção do carrossel de soluções (sem "all"). */
export interface SolutionOption {
  id: SolutionFilterId;
  labelKey: string;
}

/** Opções padrão do carrossel (sem "all"). */
export const solutionOptions: readonly SolutionOption[] = [
  { id: 'products', labelKey: 'filterCategory.solutions.products' },
  { id: 'services', labelKey: 'filterCategory.solutions.services' },
  { id: 'professionals', labelKey: 'filterCategory.solutions.professionals' },
  { id: 'programs', labelKey: 'filterCategory.solutions.programs' },
  { id: 'communities', labelKey: 'filterCategory.solutions.communities' },
] as const;

/** Soluções suportadas no marketplace (exclui "communities"). */
export type MarketplaceSolutionFilterId = Exclude<SolutionFilterId, 'communities'>;

export interface MarketplaceSolutionOption {
  id: MarketplaceSolutionFilterId;
  labelKey: string;
}

/** Opções de solução usadas pelo marketplace. */
export const marketplaceSolutionOptions: readonly MarketplaceSolutionOption[] = solutionOptions.filter(
  (option): option is MarketplaceSolutionOption => option.id !== 'communities',
);

/**
 * Regra de consistência:
 * - sem seleção de solução => comportamento equivalente a "all"
 * - "services" reaproveita tab de "products"
 * - múltiplas soluções => "all"
 */
export function resolveSolutionTabFromFilters(solutionIds: readonly SolutionFilterId[]): SolutionTab {
  if (solutionIds.length === 0) {
    return 'all';
  }
  if (solutionIds.length > 1) {
    return 'all';
  }

  const [only] = solutionIds;
  if (only === 'services') {
    return 'products';
  }

  return only;
}
