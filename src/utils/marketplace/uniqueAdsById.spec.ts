import type { Ad } from '@/types/ad';
import { appendUniqueAdsById, uniqueAdsById } from './uniqueAdsById';

const ad = (id: string): Ad =>
  ({
    id,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  } as Ad);

describe('uniqueAdsById', () => {
  it('removes duplicate ids keeping first occurrence', () => {
    expect(uniqueAdsById([ad('1'), ad('2'), ad('1')])).toEqual([ad('1'), ad('2')]);
  });
});

describe('appendUniqueAdsById', () => {
  it('appends only ads with new ids', () => {
    expect(appendUniqueAdsById([ad('1')], [ad('1'), ad('2')])).toEqual([ad('1'), ad('2')]);
  });
});
