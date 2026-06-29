import type { EventBannerData, Event } from '@/types/event';

export interface ToEventBannerParams {
  loadEvents: boolean;
  events: Event[];
  communityAvatarUrl?: string | null;
  communityProviderName?: string | null;
  defaultThumbnailUrl: string;
}

function pickEventDateValue(event: Event, candidates: string[]): string {
  const record = event as unknown as Record<string, unknown>;
  const metadata =
    record.metadata && typeof record.metadata === 'object' && !Array.isArray(record.metadata)
      ? (record.metadata as Record<string, unknown>)
      : null;

  const normalize = (value: unknown): string | null => {
    if (typeof value === 'string') {
      const normalized = value.trim();
      return normalized.length > 0 ? normalized : null;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      const millis = value > 1_000_000_000_000 ? value : value * 1000;
      return new Date(millis).toISOString();
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString();
    }
    return null;
  };

  for (const candidate of candidates) {
    const normalized = normalize(record[candidate]);
    if (normalized) {
      return normalized;
    }
  }
  if (metadata) {
    for (const candidate of candidates) {
      const normalized = normalize(metadata[candidate]);
      if (normalized) {
        return normalized;
      }
    }
  }
  return '';
}

const UNKNOWN_EVENT_RECENT_WINDOW_MS = 2 * 60 * 60 * 1000;

const EVENT_DATE_FIELDS = ['startsAt', 'startAt', 'startTime', 'start', 'date', 'time', 'start_date', 'start_time'];

function eventStartMillis(event: Event): number {
  const startsAt = pickEventDateValue(event, EVENT_DATE_FIELDS);
  if (!startsAt) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = Date.parse(startsAt);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function isEventDisplayable(event: Event): boolean {
  if (event.status === 'live' || event.status === 'scheduled') {
    return true;
  }

  if (event.status === 'unknown') {
    return eventStartMillis(event) >= Date.now() - UNKNOWN_EVENT_RECENT_WINDOW_MS;
  }

  return false;
}

function pickEventForBanner(events: Event[]): Event | undefined {
  const displayableEvents = events.filter(isEventDisplayable);
  const liveEvents = displayableEvents.filter((event) => event.status === 'live');
  const candidates = liveEvents.length > 0 ? liveEvents : displayableEvents;

  return [...candidates].sort((left, right) => eventStartMillis(left) - eventStartMillis(right))[0];
}

export function toEventBanner(params: ToEventBannerParams): EventBannerData | undefined {
  const { loadEvents, events, communityAvatarUrl, communityProviderName, defaultThumbnailUrl } = params;
  if (!loadEvents || events.length === 0) {
    return undefined;
  }

  const first = pickEventForBanner(events);
  if (!first) {
    return undefined;
  }

  const communityThumb = communityAvatarUrl?.trim();
  const thumbnail = communityThumb && communityThumb.length > 0 ? communityThumb : defaultThumbnailUrl;
  const status = first.status === 'live' ? ('Live Now' as const) : ('Scheduled' as const);

  const providerName = communityProviderName?.trim();
  return {
    id: first.id,
    title: first.title,
    host: providerName && providerName.length > 0 ? providerName : first.displayHost ?? 'Like:Me',
    status,
    startTime: pickEventDateValue(first, EVENT_DATE_FIELDS),
    endTime: pickEventDateValue(first, ['endsAt', 'endAt', 'endTime', 'end', 'end_date', 'end_time']),
    thumbnail,
    externalUrl: first.externalUrl,
    provider: first.provider,
    joinMode: first.joinMode,
  };
}
