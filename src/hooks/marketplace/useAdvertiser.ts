import { useState, useEffect, useCallback } from 'react';
import { advertiserService } from '@/services';
import type { Advertiser } from '@/types/ad';

export interface UseAdvertiserParams {
  /** ID do advertiser (dono do anúncio) a ser buscado. */
  advertiserId?: string | null;
  /** Dados já disponíveis (ex.: ad.advertiser). Evita request quando fornecidos. */
  initialAdvertiser?: Advertiser | null;
  /** Se false, não dispara a busca. Default true. */
  enabled?: boolean;
}

export interface UseAdvertiserReturn {
  advertiser: Advertiser | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook do domínio marketplace para carregar dados de um advertiser (parceiro / dono do anúncio).
 * Usa advertiserId para buscar via API; se initialAdvertiser for passado, usa até que advertiserId mude.
 */
export const useAdvertiser = (params: UseAdvertiserParams = {}): UseAdvertiserReturn => {
  const { advertiserId, initialAdvertiser = null, enabled = true } = params;
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(initialAdvertiser ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAdvertiser = useCallback(async () => {
    if (!enabled || !advertiserId || advertiserId.trim() === '') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await advertiserService.getAdvertiserById(advertiserId);
      if (response.success && response.data) {
        setAdvertiser(response.data);
      } else {
        setAdvertiser(null);
      }
    } catch (err) {
      console.error('Error loading advertiser:', err);
      setError(err instanceof Error ? err : new Error('Failed to load advertiser'));
      setAdvertiser(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, advertiserId]);

  useEffect(() => {
    if (initialAdvertiser?.id === advertiserId) {
      setAdvertiser(initialAdvertiser);
      setError(null);
      return;
    }
    if (!advertiserId || !enabled) {
      setAdvertiser(initialAdvertiser ?? null);
      setError(null);
      return;
    }
    loadAdvertiser();
  }, [advertiserId, initialAdvertiser, enabled, loadAdvertiser]);

  return {
    advertiser,
    loading,
    error,
    refresh: loadAdvertiser,
  };
};
