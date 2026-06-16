import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import type { Ad } from '@/types/ad';
import { groupMarketplaceAdsBySolutionKind } from './groupMarketplaceAdsBySolutionKind';

const baseAd = (type: string, id: string): Ad => ({
  id,
  status: 'active',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  product: {
    id: `product-${id}`,
    name: `Product ${id}`,
    status: 'active',
    type,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
});

describe('groupMarketplaceAdsBySolutionKind', () => {
  it('separa produtos, serviços e protocolos', () => {
    const ads = [
      baseAd(PRODUCT_CATALOG_TYPE.PHYSICAL, '1'),
      baseAd(PRODUCT_CATALOG_TYPE.AMAZON, '2'),
      baseAd(PRODUCT_CATALOG_TYPE.SERVICE, '3'),
      baseAd(PRODUCT_CATALOG_TYPE.PROGRAM, '4'),
    ];

    const grouped = groupMarketplaceAdsBySolutionKind(ads);

    expect(grouped.product.map((ad) => ad.id)).toEqual(['1', '2']);
    expect(grouped.service.map((ad) => ad.id)).toEqual(['3']);
    expect(grouped.program.map((ad) => ad.id)).toEqual(['4']);
  });
});
