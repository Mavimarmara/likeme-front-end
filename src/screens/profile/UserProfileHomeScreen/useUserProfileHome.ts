import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { personCategoryService, storageService, userService } from '@/services';
import { logger } from '@/utils/logger';

export const PROFILE_HOME_MAX_VISIBLE_INTERESTS = 4;

export type UserProfileHomeData = {
  displayName: string;
  email: string;
  avatarUri: string | null;
  categoryIds: string[];
};

const EMPTY_DATA: UserProfileHomeData = {
  displayName: '',
  email: '',
  avatarUri: null,
  categoryIds: [],
};

function profileDisplayName(
  person: { firstName?: string | null; lastName?: string | null } | null | undefined,
  fallbackName?: string | null,
): string {
  if (person) {
    const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
    if (fullName) return fullName;
  }
  return (fallbackName ?? '').trim();
}

async function loadSelectedCategoryIds(): Promise<string[]> {
  try {
    const categoryIds = await personCategoryService.getMySelectedCategoryIds();
    return categoryIds.slice(0, PROFILE_HOME_MAX_VISIBLE_INTERESTS);
  } catch (error) {
    logger.warn('[useUserProfileHome] Falha ao carregar categorias do backend', { cause: error });
    return [];
  }
}

export function useUserProfileHome() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserProfileHomeData>(EMPTY_DATA);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileResponse, categoryIds, storedUser] = await Promise.all([
        userService.getProfile(),
        loadSelectedCategoryIds(),
        storageService.getUser(),
      ]);

      const profile = profileResponse.success ? profileResponse.data : undefined;
      const displayName =
        profileDisplayName(profile?.person, profile?.name) ||
        profileDisplayName(storedUser?.name ? { firstName: storedUser.name } : null) ||
        '';
      const email = (profile?.email ?? storedUser?.email ?? '').trim();
      const avatarUri = profile?.picture?.trim() || profile?.avatar?.trim() || storedUser?.picture?.trim() || null;

      setData({ displayName, email, avatarUri, categoryIds });
    } catch (error) {
      logger.error('[useUserProfileHome] Falha ao carregar perfil', { cause: error });
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const setAvatarUri = useCallback((avatarUri: string | null) => {
    setData((current) => ({ ...current, avatarUri }));
  }, []);

  return { loading, data, reload: load, setAvatarUri };
}
