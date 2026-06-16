import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { useMarketplaceAds, useProducts } from '@/hooks';
import { filterAdsForMarketplaceTab } from '@/utils/marketplace/marketplaceAdSolutionKind';
import { groupMarketplaceAdsBySolutionKind } from '@/utils/marketplace/groupMarketplaceAdsBySolutionKind';
import { sortAdsByMarketplaceOrder } from '@/utils/marketplace/sorting';
import { uniqueAdsById } from '@/utils/marketplace/uniqueAdsById';
import type { Ad } from '@/types/ad';
import {
  SOLUTION_TAB_ALL,
  hasMarketplaceSearchQuery,
  isMarketplaceAllTab,
  isMarketplaceAllTabGroupedBrowsing,
  isMarketplaceProfessionalsTab,
  type MarketplaceSolutionTab,
} from '@/types/solution';

type UseMarketplaceScreenListingsParams = {
  selectedSolutionTab: MarketplaceSolutionTab;
  selectedCategoryId?: string;
  appliedSearchQuery: string;
};

export function useMarketplaceScreenListings({
  selectedSolutionTab,
  selectedCategoryId,
  appliedSearchQuery,
}: UseMarketplaceScreenListingsParams) {
  const [allTabPage, setAllTabPage] = useState(1);
  const [productsTabPage, setProductsTabPage] = useState(1);
  const [servicesTabPage, setServicesTabPage] = useState(1);
  const [programsTabPage, setProgramsTabPage] = useState(1);
  const prefetchKeyRef = useRef<string | null>(null);

  const listingsEnabled = !isMarketplaceProfessionalsTab(selectedSolutionTab);
  const listingsSearchQuery = appliedSearchQuery.trim() || undefined;
  const isProgramsTab = selectedSolutionTab === 'programs';
  const showAllTabGroupedLayout = isMarketplaceAllTabGroupedBrowsing(
    selectedSolutionTab,
    selectedCategoryId,
    appliedSearchQuery,
  );

  const resetPages = useCallback(() => {
    setAllTabPage(1);
    setProductsTabPage(1);
    setServicesTabPage(1);
    setProgramsTabPage(1);
    prefetchKeyRef.current = null;
  }, []);

  const allTab = useMarketplaceAds({
    selectedCategory: undefined,
    selectedCategoryId,
    page: allTabPage,
    searchQuery: listingsSearchQuery,
    enabled: listingsEnabled,
  });

  const productsTab = useMarketplaceAds({
    selectedCategory: 'products',
    selectedCategoryId,
    page: productsTabPage,
    searchQuery: listingsSearchQuery,
    enabled: listingsEnabled,
  });

  const servicesTab = useMarketplaceAds({
    selectedCategory: 'services',
    selectedCategoryId,
    page: servicesTabPage,
    searchQuery: listingsSearchQuery,
    enabled: listingsEnabled,
  });

  const programsTab = useProducts({
    categoryId: selectedCategoryId,
    page: programsTabPage,
    searchQuery: listingsSearchQuery,
    enabled: listingsEnabled,
  });

  const activeSource = useMemo(() => {
    switch (selectedSolutionTab) {
      case 'products':
        return { ...productsTab, page: productsTabPage };
      case 'services':
        return { ...servicesTab, page: servicesTabPage };
      case 'programs':
        return { ...programsTab, page: programsTabPage };
      case 'professionals':
        return { ads: [] as Ad[], loading: false, hasMore: false, page: 1, load: async () => {} };
      default:
        return { ...allTab, page: allTabPage };
    }
  }, [
    selectedSolutionTab,
    allTab,
    allTabPage,
    productsTab,
    productsTabPage,
    servicesTab,
    servicesTabPage,
    programsTab,
    programsTabPage,
  ]);

  useEffect(() => {
    resetPages();
  }, [selectedCategoryId, resetPages]);

  useEffect(() => {
    if (!listingsEnabled) {
      return;
    }
    const prefetchKey = `${listingsSearchQuery ?? ''}::${selectedCategoryId ?? ''}`;
    if (prefetchKeyRef.current === prefetchKey) {
      return;
    }
    prefetchKeyRef.current = prefetchKey;
    if (selectedSolutionTab !== SOLUTION_TAB_ALL) {
      void allTab.loadAds();
    }
    if (selectedSolutionTab !== 'products') {
      void productsTab.loadAds();
    }
    if (selectedSolutionTab !== 'services') {
      void servicesTab.loadAds();
    }
    if (selectedSolutionTab !== 'programs') {
      void programsTab.loadProducts();
    }
  }, [
    listingsEnabled,
    listingsSearchQuery,
    selectedCategoryId,
    selectedSolutionTab,
    allTab,
    productsTab,
    servicesTab,
    programsTab,
  ]);

  useEffect(() => {
    if (!listingsEnabled || isProgramsTab) {
      return;
    }
    if (selectedSolutionTab === 'products') {
      void productsTab.loadAds();
      return;
    }
    if (selectedSolutionTab === 'services') {
      void servicesTab.loadAds();
      return;
    }
    void allTab.loadAds();
  }, [
    listingsEnabled,
    isProgramsTab,
    selectedSolutionTab,
    allTabPage,
    productsTabPage,
    servicesTabPage,
    allTab,
    productsTab,
    servicesTab,
  ]);

  useEffect(() => {
    if (!listingsEnabled) {
      return;
    }
    const needsPrograms =
      isProgramsTab || (isMarketplaceAllTab(selectedSolutionTab) && !hasMarketplaceSearchQuery(appliedSearchQuery));
    if (!needsPrograms) {
      return;
    }
    void programsTab.loadProducts();
  }, [
    listingsEnabled,
    isProgramsTab,
    selectedSolutionTab,
    appliedSearchQuery,
    selectedCategoryId,
    programsTabPage,
    programsTab,
  ]);

  const handleLoadMore = useCallback(() => {
    const groupedPagination =
      isMarketplaceAllTab(selectedSolutionTab) && !hasMarketplaceSearchQuery(appliedSearchQuery);

    if (groupedPagination) {
      if (allTab.loading || programsTab.loading) {
        return;
      }
      if (!allTab.hasMore && !programsTab.hasMore) {
        return;
      }
      if (allTab.hasMore) {
        setAllTabPage((prev) => prev + 1);
      }
      if (programsTab.hasMore) {
        setProgramsTabPage((prev) => prev + 1);
      }
      return;
    }

    if (activeSource.loading || !activeSource.hasMore) {
      return;
    }

    switch (selectedSolutionTab) {
      case 'products':
        setProductsTabPage((prev) => prev + 1);
        break;
      case 'services':
        setServicesTabPage((prev) => prev + 1);
        break;
      case 'programs':
        setProgramsTabPage((prev) => prev + 1);
        break;
      default:
        setAllTabPage((prev) => prev + 1);
    }
  }, [appliedSearchQuery, selectedSolutionTab, allTab, programsTab, activeSource]);

  const sortedAllTabAds = useMemo(
    () =>
      sortAdsByMarketplaceOrder(uniqueAdsById(allTab.ads), DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId),
    [allTab.ads],
  );

  const groupedCategoryAds = useMemo(() => groupMarketplaceAdsBySolutionKind(sortedAllTabAds), [sortedAllTabAds]);

  const categoryProgramAds = useMemo(() => {
    const sortedProgramAds = sortAdsByMarketplaceOrder(
      programsTab.ads,
      DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId,
    );
    const seen = new Set<string>();
    const merged: Ad[] = [];
    for (const ad of [...sortedProgramAds, ...groupedCategoryAds.program]) {
      if (seen.has(ad.id)) {
        continue;
      }
      seen.add(ad.id);
      merged.push(ad);
    }
    return merged;
  }, [programsTab.ads, groupedCategoryAds.program]);

  const sortedActiveAds = useMemo(
    () =>
      sortAdsByMarketplaceOrder(
        uniqueAdsById(activeSource.ads),
        DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId,
      ),
    [activeSource.ads],
  );

  const filteredAdsBySolution = useMemo(
    () => filterAdsForMarketplaceTab(sortedActiveAds, selectedSolutionTab),
    [sortedActiveAds, selectedSolutionTab],
  );

  const highlightAdId = useMemo(() => {
    if (!isMarketplaceAllTab(selectedSolutionTab) || hasMarketplaceSearchQuery(appliedSearchQuery)) {
      return null;
    }
    if (activeSource.page !== 1) {
      return null;
    }
    return filteredAdsBySolution[0]?.id ?? null;
  }, [selectedSolutionTab, appliedSearchQuery, activeSource.page, filteredAdsBySolution]);

  const excludeHighlight = useCallback(
    (adsList: readonly Ad[]) => (highlightAdId == null ? adsList : adsList.filter((ad) => ad.id !== highlightAdId)),
    [highlightAdId],
  );

  const allTabProductAds = useMemo(
    () => excludeHighlight(groupedCategoryAds.product),
    [excludeHighlight, groupedCategoryAds.product],
  );
  const allTabServiceAds = useMemo(
    () => excludeHighlight(groupedCategoryAds.service),
    [excludeHighlight, groupedCategoryAds.service],
  );
  const allTabProgramAds = useMemo(() => excludeHighlight(categoryProgramAds), [excludeHighlight, categoryProgramAds]);

  const listAdsForCurrentTab = useMemo(() => {
    if (showAllTabGroupedLayout) {
      return allTabProductAds;
    }
    const skipHighlightSlice =
      hasMarketplaceSearchQuery(appliedSearchQuery) ||
      selectedSolutionTab === 'programs' ||
      selectedSolutionTab === 'services';
    if (skipHighlightSlice) {
      return filteredAdsBySolution;
    }
    return activeSource.page === 1 ? filteredAdsBySolution.slice(1) : filteredAdsBySolution;
  }, [
    showAllTabGroupedLayout,
    allTabProductAds,
    filteredAdsBySolution,
    activeSource.page,
    appliedSearchQuery,
    selectedSolutionTab,
  ]);

  return {
    resetPages,
    handleLoadMore,
    groupedCategoryAds,
    categoryProgramAds,
    filteredAdsBySolution,
    allTabProductAds,
    allTabServiceAds,
    allTabProgramAds,
    listAdsForCurrentTab,
    highlightAdId,
    weekHighlightAd: filteredAdsBySolution[0] ?? null,
    loading: activeSource.loading,
    hasMore: activeSource.hasMore,
    allTabLoading: allTab.loading,
    programsLoading: programsTab.loading,
    allTabHasMore: allTab.hasMore,
    programsHasMore: programsTab.hasMore,
    hasCategoryBlockContent:
      groupedCategoryAds.product.length > 0 || groupedCategoryAds.service.length > 0 || categoryProgramAds.length > 0,
    hasAllTabGroupedContent:
      (highlightAdId != null && filteredAdsBySolution[0]?.product != null) ||
      allTabServiceAds.length > 0 ||
      allTabProgramAds.length > 0 ||
      allTabProductAds.length > 0,
  };
}
