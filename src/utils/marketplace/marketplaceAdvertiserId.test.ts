import { marketplaceAdvertiserId } from './marketplaceAdvertiserId';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';

const baseProduct = {
  id: 'p1',
  name: 'Serviço',
  type: PRODUCT_CATALOG_TYPE.SERVICE,
  status: 'active' as const,
  createdAt: '',
  updatedAt: '',
};

describe('marketplaceAdvertiserId', () => {
  it('prioriza product.advertiserId', () => {
    expect(
      marketplaceAdvertiserId(
        { ...baseProduct, advertiserId: 'adv-product' },
        { id: 'ad-1', advertiserId: 'adv-ad', status: 'active', createdAt: '', updatedAt: '' },
      ),
    ).toBe('adv-product');
  });

  it('usa ad.advertiserId quando product nao tem advertiserId', () => {
    expect(
      marketplaceAdvertiserId(baseProduct, {
        id: 'ad-1',
        advertiserId: 'adv-ad',
        status: 'active',
        createdAt: '',
        updatedAt: '',
      }),
    ).toBe('adv-ad');
  });

  it('usa ad.advertiser.id quando ad.advertiserId esta ausente', () => {
    expect(
      marketplaceAdvertiserId(baseProduct, {
        id: 'ad-1',
        status: 'active',
        createdAt: '',
        updatedAt: '',
        advertiser: {
          id: 'adv-nested',
          name: 'Provider',
          status: 'active',
          createdAt: '',
          updatedAt: '',
        },
      }),
    ).toBe('adv-nested');
  });

  it('usa product.ads[0].advertiserId quando ad ainda nao carregou', () => {
    expect(
      marketplaceAdvertiserId(
        {
          ...baseProduct,
          ads: [
            {
              id: 'ad-embedded',
              advertiserId: 'adv-embedded',
              status: 'active',
              createdAt: '',
              updatedAt: '',
            },
          ],
        },
        null,
      ),
    ).toBe('adv-embedded');
  });

  it('usa product.ads[0].advertiser.id como fallback', () => {
    expect(
      marketplaceAdvertiserId(
        {
          ...baseProduct,
          ads: [
            {
              id: 'ad-embedded',
              status: 'active',
              createdAt: '',
              updatedAt: '',
              advertiser: {
                id: 'adv-from-ad-object',
                userId: 'user-1',
                name: 'Provider',
                status: 'active',
                createdAt: '',
                updatedAt: '',
              },
            },
          ],
        },
        null,
      ),
    ).toBe('adv-from-ad-object');
  });

  it('retorna undefined quando nao ha provider identificavel', () => {
    expect(marketplaceAdvertiserId(baseProduct, null)).toBeUndefined();
  });
});
