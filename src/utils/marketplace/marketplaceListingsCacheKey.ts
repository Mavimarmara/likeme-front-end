export function buildMarketplaceAdsFiltersKey(filters: {
  selectedCategory?: string;
  selectedCategoryId?: string | null;
}): string {
  return [filters.selectedCategory ?? '', filters.selectedCategoryId ?? ''].join('|');
}

export function buildMarketplaceProgramsFiltersKey(filters: { categoryId?: string | null }): string {
  return [filters.categoryId ?? ''].join('|');
}

export function marketplaceAdsCacheKey(
  searchQuery: string | undefined,
  filters: { selectedCategory?: string; selectedCategoryId?: string | null },
): string {
  const trimmedSearch = searchQuery?.trim() ?? '';
  return `ads::${trimmedSearch}::${buildMarketplaceAdsFiltersKey(filters)}`;
}

export function marketplaceProgramsCacheKey(
  searchQuery: string | undefined,
  filters: { categoryId?: string | null },
): string {
  const trimmedSearch = searchQuery?.trim() ?? '';
  return `programs::${trimmedSearch}::${buildMarketplaceProgramsFiltersKey(filters)}`;
}

export function providerAdsCacheKey(advertiserId: string | undefined, selectedCategory: string | undefined): string {
  const advertiser = advertiserId?.trim() ?? '';
  const category = selectedCategory?.trim() ?? '';
  return `provider::${advertiser}::${category}`;
}
