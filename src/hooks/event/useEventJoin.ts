import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { eventService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { logger } from '@/utils/logger';
import { getReadableErrorMessage } from '@/utils/error/readableErrorMessage';
import { effectiveJoinMode } from '@/utils/event/effectiveJoinMode';
import { parseJoinPayload } from '@/utils/event/parseJoinPayload';
import { toEventBanner } from '@/utils/event/toEventBanner';
import type { EventBannerData, Event, EventJoinPayload } from '@/types/event';

const DEFAULT_EVENT_BANNER_THUMB = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';

export interface UseEventJoinOptions {
  loadEvents?: boolean;
  events?: Event[];
  communityAvatarUrl?: string | null;
  defaultThumbnailUrl?: string;
}

export interface UseEventJoinReturn {
  eventBanner: EventBannerData | undefined;
  eventJoinPayload: EventJoinPayload | null;
  eventJoinBusy: boolean;
  onZoomMeetingOpened: () => void;
  onZoomMeetingFailed: (error: Error) => void;
  handleEventBannerPress: (banner: EventBannerData) => Promise<void>;
}

export const useEventJoin = (options: UseEventJoinOptions = {}): UseEventJoinReturn => {
  const {
    loadEvents = false,
    events = [],
    communityAvatarUrl,
    defaultThumbnailUrl = DEFAULT_EVENT_BANNER_THUMB,
  } = options;

  const { t } = useTranslation();
  const [eventJoinPayload, setEventJoinPayload] = useState<EventJoinPayload | null>(null);
  const [eventJoinBusy, setEventJoinBusy] = useState(false);
  const joinRequestSeq = useRef(0);

  const eventBanner = useMemo(
    () =>
      toEventBanner({
        loadEvents,
        events,
        communityAvatarUrl,
        defaultThumbnailUrl,
      }),
    [loadEvents, events, communityAvatarUrl, defaultThumbnailUrl],
  );

  const onZoomMeetingOpened = useCallback(() => {
    setEventJoinBusy(false);
  }, []);

  const onZoomMeetingFailed = useCallback(
    (error: Error) => {
      setEventJoinPayload(null);
      setEventJoinBusy(false);
      logger.error('[useEventJoin] Falha ao entrar no evento Zoom', { message: error.message, cause: error });
      Alert.alert(t('common.error'), error.message);
    },
    [t],
  );

  const handleEventBannerPress = useCallback(
    async (banner: EventBannerData) => {
      const mode = effectiveJoinMode(banner);
      const url = banner.externalUrl?.trim();
      if (mode === 'none' || !url) {
        return;
      }
      if (mode === 'external_browser') {
        Linking.openURL(url).catch((linkError: Error) => {
          logger.error('[useEventJoin] Falha ao abrir link do evento', { url, error: linkError });
        });
        return;
      }

      const seq = ++joinRequestSeq.current;
      setEventJoinBusy(true);
      setEventJoinPayload(null);
      try {
        const res = await eventService.requestZoomJoinPayload(url);
        if (seq !== joinRequestSeq.current) {
          return;
        }
        setEventJoinPayload(parseJoinPayload(res));
      } catch (err) {
        if (seq !== joinRequestSeq.current) {
          return;
        }
        logger.error('[useEventJoin] Falha ao obter payload Zoom', { url, err });
        const message = getReadableErrorMessage(err, 'Não foi possível abrir o evento');
        Alert.alert(t('common.error'), message);
        setEventJoinBusy(false);
      }
    },
    [t],
  );

  return {
    eventBanner,
    eventJoinPayload,
    eventJoinBusy,
    onZoomMeetingOpened,
    onZoomMeetingFailed,
    handleEventBannerPress,
  };
};
