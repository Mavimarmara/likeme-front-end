import { useCallback, useRef } from 'react';
import type { PublicUser } from '@/types/user/publicUser';
import publicUserService from '@/services/user/publicUserService';
import { storageService } from '@/services';
import { resolveOptimisticCommentAuthorLabel } from '@/utils/community/commentAuthorDisplayName';

const CURRENT_USER_KEY = 'me';

const EMPTY_PUBLIC_USER: PublicUser = {
  name: 'Usuário',
  username: null,
  avatar: null,
};

export function useUser() {
  const cacheRef = useRef(new Map<string, PublicUser>());
  const inflightRef = useRef(new Map<string, Promise<PublicUser>>());

  const getPublicUser = useCallback(async (userId: string): Promise<PublicUser> => {
    const id = userId.trim();
    if (!id) {
      return EMPTY_PUBLIC_USER;
    }

    if (id === CURRENT_USER_KEY) {
      const stored = await storageService.getUser();
      return {
        name: resolveOptimisticCommentAuthorLabel(stored),
        username: null,
        avatar: stored?.picture?.trim() || null,
      };
    }

    const cached = cacheRef.current.get(id);
    if (cached) {
      return cached;
    }

    const inflight = inflightRef.current.get(id);
    if (inflight) {
      return inflight;
    }

    const request = publicUserService.getPublicUser(id).then((user) => {
      cacheRef.current.set(id, user);
      return user;
    });

    inflightRef.current.set(id, request);

    try {
      return await request;
    } finally {
      inflightRef.current.delete(id);
    }
  }, []);

  return { getPublicUser };
}
