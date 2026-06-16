import {
  SOLUTION_TAB_ALL,
  isMarketplaceAllTabGroupedBrowsing,
  isMarketplaceCategoryBrowsing,
  marketplaceSolutionIdsForTab,
  resolveMarketplaceSolutionTabFromFilters,
  resolveSolutionTabFromFilters,
  showMarketplaceSolutionKindLayout,
} from './index';

describe('resolveMarketplaceSolutionTabFromFilters', () => {
  it('returns all when no solution is selected', () => {
    expect(resolveMarketplaceSolutionTabFromFilters([])).toBe(SOLUTION_TAB_ALL);
  });

  it('returns the single marketplace solution tab', () => {
    expect(resolveMarketplaceSolutionTabFromFilters(['services'])).toBe('services');
  });

  it('keeps current tab when it remains in multi-select filters', () => {
    expect(resolveMarketplaceSolutionTabFromFilters(['products', 'services'], 'services')).toBe('services');
  });

  it('falls back to the first supported tab in multi-select', () => {
    expect(resolveMarketplaceSolutionTabFromFilters(['products', 'programs'], 'all')).toBe('products');
  });
});

describe('resolveSolutionTabFromFilters', () => {
  it('maps services to products on home', () => {
    expect(resolveSolutionTabFromFilters(['services'])).toBe('products');
  });
});

describe('marketplaceSolutionIdsForTab', () => {
  it('returns empty list for all tab', () => {
    expect(marketplaceSolutionIdsForTab(SOLUTION_TAB_ALL)).toEqual([]);
  });

  it('returns selected solution id for specific tab', () => {
    expect(marketplaceSolutionIdsForTab('programs')).toEqual(['programs']);
  });
});

describe('marketplace layout predicates', () => {
  it('detects category browsing', () => {
    expect(isMarketplaceCategoryBrowsing(SOLUTION_TAB_ALL, 'cat-1', '')).toBe(true);
    expect(isMarketplaceCategoryBrowsing('products', 'cat-1', '')).toBe(false);
  });

  it('detects all-tab grouped browsing without category or search', () => {
    expect(isMarketplaceAllTabGroupedBrowsing(SOLUTION_TAB_ALL, undefined, '')).toBe(true);
    expect(isMarketplaceAllTabGroupedBrowsing(SOLUTION_TAB_ALL, 'cat-1', '')).toBe(false);
    expect(isMarketplaceAllTabGroupedBrowsing(SOLUTION_TAB_ALL, undefined, 'vitamina')).toBe(false);
  });

  it('detects solution-kind layout for services and programs tabs', () => {
    expect(showMarketplaceSolutionKindLayout('services', undefined, '')).toBe(true);
    expect(showMarketplaceSolutionKindLayout('products', undefined, '')).toBe(false);
  });
});
