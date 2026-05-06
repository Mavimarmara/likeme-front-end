import type { EventBannerData, Event } from '@/types/event';

export interface ToEventBannerParams {
  loadEvents: boolean;
  events: Event[];
  communityAvatarUrl?: string | null;
  defaultThumbnailUrl: string;
}

export function toEventBanner(params: ToEventBannerParams): EventBannerData | undefined {
  const { loadEvents, events, communityAvatarUrl, defaultThumbnailUrl } = params;
  if (!loadEvents || events.length === 0) {
    return undefined;
  }

  const first = events[0];
  const communityThumb = communityAvatarUrl?.trim();
  const thumbnail = communityThumb && communityThumb.length > 0 ? communityThumb : defaultThumbnailUrl;
  const status = first.status === 'scheduled' ? ('Scheduled' as const) : ('Live Now' as const);

  return {
    id: first.id,
    title: first.title,
    host: first.displayHost ?? 'Like:Me',
    status,
    startTime: first.startsAt || '08:00 pm',
    endTime: first.endsAt || '10:00 pm',
    thumbnail,
    externalUrl: first.externalUrl,
    provider: first.provider,
    joinMode: first.joinMode,
  };
}
