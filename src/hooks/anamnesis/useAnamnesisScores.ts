import { useState, useEffect, useCallback } from 'react';
import anamnesisService from '@/services/anamnesis/anamnesisService';
import userService from '@/services/user/userService';
import { logger } from '@/utils/logger';
import type { UserScores } from '@/types/anamnesis';

export const useAnamnesisScores = () => {
  const [scores, setScores] = useState<UserScores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const profileResponse = await userService.getProfile();
      const userId = profileResponse.success ? profileResponse.data?.id : null;
      if (!userId) {
        throw new Error('Usuário não identificado');
      }

      const scoresResponse = await anamnesisService.getUserScores({ userId });

      if (scoresResponse.success && scoresResponse.data) {
        setScores(scoresResponse.data);
        logger.debug('Anamnesis scores fetched:', scoresResponse.data);
      } else {
        throw new Error('Erro ao buscar scores');
      }
    } catch (err: any) {
      logger.error('Error fetching anamnesis scores:', err);
      setError(err.message || 'Erro ao buscar scores');
      setScores(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return {
    scores,
    loading,
    error,
    refresh: () => fetchScores(true),
  };
};
