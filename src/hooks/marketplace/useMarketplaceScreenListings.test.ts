import { marketplaceCurrentTabAds } from '@/hooks/marketplace/useMarketplaceScreenListings';
import { SOLUTION_TAB_ALL } from '@/types/solution';
import type { Ad } from '@/types/ad';

const marketplaceAd = (id: string): Ad => ({
  id,
  status: 'active',
  createdAt: '2026-06-26T00:00:00.000Z',
  updatedAt: '2026-06-26T00:00:00.000Z',
});

describe('marketplaceCurrentTabAds', () => {
  const firstAd = marketplaceAd('ad-first');
  const secondAd = marketplaceAd('ad-second');

  it('mantém o primeiro anúncio na aba Produtos sem busca', () => {
    const ads = marketplaceCurrentTabAds({
      showAllTabGroupedLayout: false,
      allTabProductAds: [],
      filteredAdsBySolution: [firstAd, secondAd],
      activePage: 1,
      appliedSearchQuery: '',
      selectedSolutionTab: 'products',
    });

    expect(ads.map((ad) => ad.id)).toEqual(['ad-first', 'ad-second']);
  });

  it('preserva a remoção do item reservado para destaque na aba Todos', () => {
    const ads = marketplaceCurrentTabAds({
      showAllTabGroupedLayout: false,
      allTabProductAds: [],
      filteredAdsBySolution: [firstAd, secondAd],
      activePage: 1,
      appliedSearchQuery: '',
      selectedSolutionTab: SOLUTION_TAB_ALL,
    });

    expect(ads.map((ad) => ad.id)).toEqual(['ad-second']);
  });

  it('usa os produtos já deduplicados quando o layout agrupado está ativo', () => {
    const groupedAd = marketplaceAd('grouped-product');

    const ads = marketplaceCurrentTabAds({
      showAllTabGroupedLayout: true,
      allTabProductAds: [groupedAd],
      filteredAdsBySolution: [firstAd, secondAd],
      activePage: 1,
      appliedSearchQuery: '',
      selectedSolutionTab: SOLUTION_TAB_ALL,
    });

    expect(ads.map((ad) => ad.id)).toEqual(['grouped-product']);
  });
});
