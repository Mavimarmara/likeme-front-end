import { useCallback } from 'react';
import type { PublicUser } from '@/types/user/publicUser';
import publicUserService from '@/services/user/publicUserService';
import {
  deleteInflightPublicUser,
  getCachedPublicUser,
  getInflightPublicUser,
  setCachedPublicUser,
  setInflightPublicUser,
} from '@/services/user/publicUserCache';
import { storageService } from '@/services';
import { resolveOptimisticCommentAuthorLabel } from '@/utils/community/commentAuthorDisplayName';

const CURRENT_USER_KEY = 'me';

const EMPTY_PUBLIC_USER: PublicUser = {
  name: 'Usuário',
  username: null,
  avatar: null,
};

export function useUser() {
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

    const cached = getCachedPublicUser(id);
    if (cached) {
      return cached;
    }

    const inflight = getInflightPublicUser(id);
    if (inflight) {
      return inflight;
    }

    const request = publicUserService.getPublicUser(id).then((user) => {
      setCachedPublicUser(id, user);
      return user;
    });

    setInflightPublicUser(id, request);

    try {
      return await request;
    } finally {
      deleteInflightPublicUser(id);
    }
  }, []);

  return { getPublicUser };
}
