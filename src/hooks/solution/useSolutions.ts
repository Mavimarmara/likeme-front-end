import { useMemo } from 'react';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { useTranslation } from '@/hooks/i18n';
import {
  solutionOptions,
  marketplaceSolutionOptions as marketplaceSolutionBaseOptions,
  type MarketplaceSolutionFilterId,
  type SolutionFilterId,
} from '@/types/solution';

type AllSolutionId = 'all';

export function useSolutions() {
  const { t } = useTranslation();

  const homeSolutionOptions = useMemo<ButtonCarouselOption<SolutionFilterId>[]>(
    () => solutionOptions.map((option) => ({ id: option.id, label: t(option.labelKey) })),
    [t],
  );

  const marketplaceSolutionOptions = useMemo<ButtonCarouselOption<MarketplaceSolutionFilterId>[]>(
    () =>
      marketplaceSolutionBaseOptions.map((option) => ({
        id: option.id as MarketplaceSolutionFilterId,
        label: t(option.labelKey),
      })),
    [t],
  );

  const homeCarouselOptions = useMemo<ButtonCarouselOption<SolutionFilterId | AllSolutionId>[]>(
    () => [{ id: 'all', label: t('common.all') }, ...homeSolutionOptions],
    [homeSolutionOptions, t],
  );

  const marketplaceCarouselOptions = useMemo<ButtonCarouselOption<MarketplaceSolutionFilterId | AllSolutionId>[]>(
    () => [{ id: 'all', label: t('common.all') }, ...marketplaceSolutionOptions],
    [marketplaceSolutionOptions, t],
  );

  return {
    homeCarouselOptions,
    homeSolutionOptions,
    marketplaceCarouselOptions,
    marketplaceSolutionOptions,
  };
}
