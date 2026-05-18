import { useCallback, useEffect, useMemo, useState } from 'react';
import { acquisitionListService } from '@/services/profile/acquisitionListService';
import { filterAcquisitionItems } from '@/utils/profile/acquisitionListMapper';
import type { AcquisitionListItem } from '@/types/acquisition/acquisition';
import { useTranslation } from '@/hooks/i18n';
import { logger } from '@/utils/logger';

export function useAcquisitionList() {
  const { t } = useTranslation();
  const [protocols, setProtocols] = useState<AcquisitionListItem[]>([]);
  const [services, setServices] = useState<AcquisitionListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await acquisitionListService.loadAcquisitionList(t);
      setProtocols(data.protocols);
      setServices(data.services);
    } catch (loadError) {
      logger.error('[useAcquisitionList] Erro ao carregar aquisições', loadError);
      setError(t('profile.acquisitionList.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredProtocols = useMemo(() => filterAcquisitionItems(protocols, searchQuery), [protocols, searchQuery]);

  const filteredServices = useMemo(() => filterAcquisitionItems(services, searchQuery), [services, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    loading,
    error,
    protocols: filteredProtocols,
    services: filteredServices,
    reload: load,
  };
}
