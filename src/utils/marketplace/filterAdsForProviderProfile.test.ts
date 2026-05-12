import { describe, it, expect } from '@jest/globals';
import type { Ad } from '@/types/ad';
import { filterAdsForProviderProfile } from './filterAdsForProviderProfile';

const baseAd = (overrides: Partial<Ad> = {}): Ad => ({
  id: 'ad-1',
  status: 'active',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  ...overrides,
});

describe('filterAdsForProviderProfile', () => {
  it('mantém anúncios do advertiserId do perfil', () => {
    const ads = [
      baseAd({
        id: 'a1',
        advertiserId: 'adv-1',
        advertiser: { id: 'adv-1', name: 'X', status: 'active', createdAt: '', updatedAt: '' },
      }),
      baseAd({
        id: 'a2',
        advertiserId: 'adv-2',
        advertiser: { id: 'adv-2', name: 'Y', status: 'active', createdAt: '', updatedAt: '' },
      }),
    ];
    const result = filterAdsForProviderProfile(ads, 'adv-1', undefined);
    expect(result.map((a) => a.id)).toEqual(['a1']);
  });

  it('quando há userId do provider, exige userId do anunciante do anúncio', () => {
    const ads = [
      baseAd({
        id: 'ok',
        advertiserId: 'adv-1',
        advertiser: {
          id: 'adv-1',
          userId: 'user-99',
          name: 'X',
          status: 'active',
          createdAt: '',
          updatedAt: '',
        },
      }),
      baseAd({
        id: 'wrong-user',
        advertiserId: 'adv-1',
        advertiser: {
          id: 'adv-1',
          userId: 'user-other',
          name: 'X',
          status: 'active',
          createdAt: '',
          updatedAt: '',
        },
      }),
    ];
    const result = filterAdsForProviderProfile(ads, 'adv-1', 'user-99');
    expect(result.map((a) => a.id)).toEqual(['ok']);
  });

  it('com userId do provider, aceita anúncio sem userId no nested quando advertiserId bate', () => {
    const ads = [
      baseAd({
        id: 'legacy',
        advertiserId: 'adv-1',
        advertiser: { id: 'adv-1', name: 'X', status: 'active', createdAt: '', updatedAt: '' },
      }),
    ];
    const result = filterAdsForProviderProfile(ads, 'adv-1', 'user-99');
    expect(result.map((a) => a.id)).toEqual(['legacy']);
  });
});
