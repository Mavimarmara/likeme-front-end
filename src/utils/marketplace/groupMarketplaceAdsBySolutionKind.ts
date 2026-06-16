import type { Ad } from '@/types/ad';
import { marketplaceAdSolutionKind, type MarketplaceAdSolutionKind } from './marketplaceAdSolutionKind';

export type MarketplaceAdsBySolutionKind = Record<MarketplaceAdSolutionKind, Ad[]>;

export function groupMarketplaceAdsBySolutionKind(ads: readonly Ad[]): MarketplaceAdsBySolutionKind {
  const grouped: MarketplaceAdsBySolutionKind = {
    product: [],
    service: [],
    program: [],
  };

  for (const ad of ads) {
    const kind = marketplaceAdSolutionKind(ad);
    if (kind != null) {
      grouped[kind].push(ad);
    }
  }

  return grouped;
}
