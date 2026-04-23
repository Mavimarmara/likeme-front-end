import { useState, useEffect, useCallback, useRef } from 'react';
import { communityService } from '@/services';
import { logger } from '@/utils/logger';

export type UseCommunityOptions = {
  /** Id da comunidade em foco (ex.: primeira da lista). Sem id, termos permanecem `null`. */
  communityId: string | undefined;
};

export type UseCommunityReturn = {
  /** `null` até o GET; em seguida espelha `hasTermsAccepted` do backend */
  termsAccepted: boolean | null;
  toggleTermsAccepted: () => void;
};

export const useCommunity = ({ communityId }: UseCommunityOptions): UseCommunityReturn => {
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const latestCommunityIdRef = useRef(communityId);
  latestCommunityIdRef.current = communityId;

  useEffect(() => {
    if (!communityId) {
      setTermsAccepted(null);
      return;
    }
    setTermsAccepted(null);
    let cancelled = false;
    void (async () => {
      try {
        const accepted = await communityService.getMyCommunityTermsAccepted(communityId);
        if (cancelled) return;
        setTermsAccepted(accepted);
      } catch (error) {
        logger.error('Falha ao carregar aceite dos termos da comunidade', { communityId, cause: error });
        if (!cancelled) {
          setTermsAccepted(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  const toggleTermsAccepted = useCallback(() => {
    if (!communityId) return;
    const targetCommunityId = communityId;
    setTermsAccepted((prev) => {
      if (prev === null) return prev;
      const next = !prev;
      void communityService
        .updateMyCommunityTermsAccepted(targetCommunityId, next)
        .then((acceptedFromServer) => {
          if (latestCommunityIdRef.current !== targetCommunityId) return;
          setTermsAccepted(acceptedFromServer);
        })
        .catch((error) => {
          setTermsAccepted(prev);
          logger.error('Falha ao persistir aceite dos termos da comunidade', {
            communityId: targetCommunityId,
            attemptedValue: next,
            cause: error,
          });
        });
      return next;
    });
  }, [communityId]);

  return { termsAccepted, toggleTermsAccepted };
};
