import { useCallback, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { logger } from '@/utils/logger';
import { effectiveJoinMode } from '@/utils/event/effectiveJoinMode';
import { toEventBanner } from '@/utils/event/toEventBanner';
import type { EventBannerData, Event } from '@/types/event';

const DEFAULT_EVENT_BANNER_THUMB = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';

export interface UseEventJoinOptions {
  loadEvents?: boolean;
  events?: Event[];
  communityAvatarUrl?: string | null;
  communityProviderName?: string | null;
  defaultThumbnailUrl?: string;
}

export interface UseEventJoinReturn {
  eventBanner: EventBannerData | undefined;
  eventJoinUrl: string | null;
  closeEventSession: () => void;
  handleEventBannerPress: (banner: EventBannerData) => Promise<void>;
}

export const useEventJoin = (options: UseEventJoinOptions = {}): UseEventJoinReturn => {
  const {
    loadEvents = false,
    events = [],
    communityAvatarUrl,
    communityProviderName,
    defaultThumbnailUrl = DEFAULT_EVENT_BANNER_THUMB,
  } = options;

  const [eventJoinUrl, setEventJoinUrl] = useState<string | null>(null);

  const eventBanner = useMemo(
    () =>
      toEventBanner({
        loadEvents,
        events,
        communityAvatarUrl,
        communityProviderName,
        defaultThumbnailUrl,
      }),
    [loadEvents, events, communityAvatarUrl, communityProviderName, defaultThumbnailUrl],
  );

  const closeEventSession = useCallback(() => {
    setEventJoinUrl(null);
  }, []);

  const handleEventBannerPress = useCallback(async (banner: EventBannerData) => {
    const mode = effectiveJoinMode(banner);
    const url = banner.externalUrl?.trim();
    if (mode === 'none' || !url) {
      return;
    }
    if (mode === 'external_browser' || mode === 'zoom_sdk') {
      Linking.openURL(url).catch((linkError: Error) => {
        logger.error('[useEventJoin] Falha ao abrir link do evento', { url, error: linkError });
      });
      return;
    }

    setEventJoinUrl(url);
  }, []);

  return {
    eventBanner,
    eventJoinUrl,
    closeEventSession,
    handleEventBannerPress,
  };
};
