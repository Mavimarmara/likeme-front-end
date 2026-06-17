import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import {
  cartProtocolProductIdsWithActiveAccess,
  isProtocolCartItem,
  isProtocolProductCatalogType,
  protocolProductIdsFromSubscriptions,
  userHasActiveProtocolProduct,
  userOwnsProtocolFromSubscriptions,
} from '@/utils/profile/protocolProduct';
import { subscriptionService } from '@/services/payment/subscriptionService';

jest.mock('@/services/payment/subscriptionService', () => ({
  subscriptionService: {
    getProtocolAccess: jest.fn(),
  },
}));

const getProtocolAccess = subscriptionService.getProtocolAccess as jest.Mock;

describe('protocolProduct', () => {
  it('isProtocolProductCatalogType usa PRODUCT_CATALOG_TYPE.PROGRAM', () => {
    expect(isProtocolProductCatalogType(PRODUCT_CATALOG_TYPE.PROGRAM)).toBe(true);
    expect(isProtocolProductCatalogType(' program ')).toBe(true);
    expect(isProtocolProductCatalogType('PROGRAM')).toBe(true);
    expect(isProtocolProductCatalogType('program')).toBe(true);
    expect(isProtocolProductCatalogType(PRODUCT_CATALOG_TYPE.SERVICE)).toBe(false);
  });

  it('isProtocolCartItem reconcilia type legado em tags', () => {
    expect(isProtocolCartItem({ type: undefined, tags: [PRODUCT_CATALOG_TYPE.PROGRAM] })).toBe(true);
    expect(isProtocolCartItem({ type: PRODUCT_CATALOG_TYPE.PHYSICAL })).toBe(false);
  });

  it('userOwnsProtocolFromSubscriptions espelha productIds de Meus Protocolos', () => {
    const subscriptions = [
      {
        id: 'sub-1',
        productId: 'prog-a',
        status: 'ACTIVE',
        nextBillingAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        product: { id: 'prog-a', name: 'A', image: null, type: PRODUCT_CATALOG_TYPE.PROGRAM },
      },
    ];

    expect(userOwnsProtocolFromSubscriptions(subscriptions, 'prog-a')).toBe(true);
    expect(userOwnsProtocolFromSubscriptions(subscriptions, 'prog-b')).toBe(false);
    expect(protocolProductIdsFromSubscriptions(subscriptions)).toEqual(new Set(['prog-a']));
  });

  it('userHasActiveProtocolProduct delega para getProtocolAccess', async () => {
    getProtocolAccess.mockResolvedValueOnce({ success: true, data: { hasAccess: true, subscription: null } });
    await expect(userHasActiveProtocolProduct('prog-1')).resolves.toBe(true);
    expect(getProtocolAccess).toHaveBeenCalledWith('prog-1');

    getProtocolAccess.mockResolvedValueOnce({ success: true, data: { hasAccess: false, subscription: null } });
    await expect(userHasActiveProtocolProduct('prog-2')).resolves.toBe(false);
  });

  it('cartProtocolProductIdsWithActiveAccess retorna ids de protocolos já possuídos', async () => {
    getProtocolAccess.mockImplementation(async (productId: string) => ({
      success: true,
      data: { hasAccess: productId === 'owned-prog', subscription: null },
    }));

    const owned = await cartProtocolProductIdsWithActiveAccess([
      { id: 'owned-prog', type: PRODUCT_CATALOG_TYPE.PROGRAM },
      { id: 'new-prog', type: PRODUCT_CATALOG_TYPE.PROGRAM },
      { id: 'physical-1', type: PRODUCT_CATALOG_TYPE.PHYSICAL },
    ]);

    expect(owned).toEqual(['owned-prog']);
  });
});
