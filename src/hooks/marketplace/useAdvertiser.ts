import { useMemo } from 'react';
import { useAdvertisers } from './useAdvertisers';
import type { Advertiser } from '@/types/ad';
import type { UseAdvertisersListOptions, UseAdvertisersParams, UseAdvertisersReturn } from './useAdvertisers';

export type UseAdvertiserParams = UseAdvertisersParams;
export type UseAdvertiserListOptions = UseAdvertisersListOptions;

export type UseAdvertiserReturn = UseAdvertisersReturn & {
  advertiser: Advertiser | null;
};

export const useAdvertiser = (params: UseAdvertiserParams = {}): UseAdvertiserReturn => {
  const base = useAdvertisers(params);

  const advertiser = useMemo(() => base.advertisers[0] ?? null, [base.advertisers]);

  return {
    ...base,
    advertiser,
  };
};

export type { UseAdvertisersListOptions, UseAdvertisersParams, UseAdvertisersReturn };
