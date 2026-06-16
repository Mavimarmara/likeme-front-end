/** Soluções que podem ser escolhidas nos filtros. */
export type SolutionFilterId = 'communities' | 'products' | 'professionals' | 'programs' | 'services';

/** Valor da aba "Todos" (Home e marketplace). */
export const SOLUTION_TAB_ALL = 'all' as const;

/** Abas de solução da Home. "all" é estado derivado quando nenhum filtro de solução está ativo. */
export type SolutionTab = typeof SOLUTION_TAB_ALL | Exclude<SolutionFilterId, 'services'>;

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

/** Aba ativa do carrossel do marketplace (inclui "services" como aba própria). */
export type MarketplaceSolutionTab = typeof SOLUTION_TAB_ALL | MarketplaceSolutionFilterId;

export interface MarketplaceSolutionOption {
  id: MarketplaceSolutionFilterId;
  labelKey: string;
}

/** Opções de solução usadas pelo marketplace. */
export const marketplaceSolutionOptions: readonly MarketplaceSolutionOption[] = solutionOptions.filter(
  (option): option is MarketplaceSolutionOption => option.id !== 'communities',
);

export const MARKETPLACE_SOLUTION_FILTER_IDS: ReadonlySet<MarketplaceSolutionFilterId> = new Set(
  marketplaceSolutionOptions.map((option) => option.id),
);

export function isMarketplaceSolutionFilterId(id: string): id is MarketplaceSolutionFilterId {
  return MARKETPLACE_SOLUTION_FILTER_IDS.has(id as MarketplaceSolutionFilterId);
}

export function isMarketplaceAllTab(tab: MarketplaceSolutionTab): tab is typeof SOLUTION_TAB_ALL {
  return tab === SOLUTION_TAB_ALL;
}

export function isMarketplaceProfessionalsTab(tab: MarketplaceSolutionTab): tab is 'professionals' {
  return tab === 'professionals';
}

export function marketplaceSolutionIdsForTab(tab: MarketplaceSolutionTab): SolutionFilterId[] {
  return isMarketplaceAllTab(tab) ? [] : [tab];
}

export function hasMarketplaceSearchQuery(searchQuery: string): boolean {
  return searchQuery.trim().length > 0;
}

export function isMarketplaceCategoryBrowsing(
  tab: MarketplaceSolutionTab,
  categoryId: string | undefined,
  appliedSearchQuery: string,
): boolean {
  return categoryId != null && isMarketplaceAllTab(tab) && !hasMarketplaceSearchQuery(appliedSearchQuery);
}

export function isMarketplaceAllTabGroupedBrowsing(
  tab: MarketplaceSolutionTab,
  categoryId: string | undefined,
  appliedSearchQuery: string,
): boolean {
  return isMarketplaceAllTab(tab) && categoryId == null && !hasMarketplaceSearchQuery(appliedSearchQuery);
}

export function usesMarketplaceSolutionKindLayout(tab: MarketplaceSolutionTab): boolean {
  return tab === 'services' || tab === 'programs';
}

export function showMarketplaceSolutionKindLayout(
  tab: MarketplaceSolutionTab,
  categoryId: string | undefined,
  appliedSearchQuery: string,
): boolean {
  return (
    isMarketplaceCategoryBrowsing(tab, categoryId, appliedSearchQuery) ||
    isMarketplaceAllTabGroupedBrowsing(tab, categoryId, appliedSearchQuery) ||
    usesMarketplaceSolutionKindLayout(tab)
  );
}

/**
 * Marketplace: cada solução do filtro vira aba própria (inclui "services").
 * Home: "services" reaproveita aba "products"; múltiplas soluções => "all".
 */
export function resolveMarketplaceSolutionTabFromFilters(
  solutionIds: readonly SolutionFilterId[],
  currentTab?: MarketplaceSolutionTab,
): MarketplaceSolutionTab {
  if (solutionIds.length === 0) {
    return SOLUTION_TAB_ALL;
  }
  if (solutionIds.length === 1 && isMarketplaceSolutionFilterId(solutionIds[0])) {
    return solutionIds[0];
  }
  if (currentTab != null && solutionIds.includes(currentTab as SolutionFilterId)) {
    return currentTab;
  }
  const firstSupported = solutionIds.find(isMarketplaceSolutionFilterId);
  return firstSupported ?? SOLUTION_TAB_ALL;
}

/**
 * Regra de consistência da Home:
 * - sem seleção de solução => comportamento equivalente a "all"
 * - "services" reaproveita tab de "products"
 * - múltiplas soluções => "all"
 */
export function resolveSolutionTabFromFilters(solutionIds: readonly SolutionFilterId[]): SolutionTab {
  if (solutionIds.length === 0) {
    return SOLUTION_TAB_ALL;
  }
  if (solutionIds.length > 1) {
    return SOLUTION_TAB_ALL;
  }

  const [only] = solutionIds;
  if (only === 'services') {
    return 'products';
  }

  return only;
}
