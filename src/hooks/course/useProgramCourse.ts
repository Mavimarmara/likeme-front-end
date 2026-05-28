import { useCallback, useEffect, useRef, useState } from 'react';
import { courseService } from '@/services/course/courseService';
import type { ProgramCourse } from '@/types/course/course';
import { logger } from '@/utils/logger';

export function useProgramCourse(communityId: string, enabled: boolean) {
  const [course, setCourse] = useState<ProgramCourse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    const trimmed = communityId.trim();
    if (!enabled || !trimmed) {
      setCourse(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    try {
      setLoading(true);
      setError(null);

      const response = await courseService.getProgramCourseByCommunityId(trimmed);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao carregar conteúdo do protocolo');
      }

      setCourse(response.data);
    } catch (loadError) {
      logger.error('[useProgramCourse] Falha ao carregar curso do protocolo', loadError);
      setCourse(null);
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar conteúdo do protocolo');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [communityId, enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    course,
    loading,
    error,
    reload: load,
  };
}
