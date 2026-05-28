import type { Event, FeedEvent } from '@/types/event';
import { formatEventTimeRange } from '@/utils/event/formatEventTimeRange';

function pickIsoDate(event: Event, fieldNames: string[]): string {
  const record = event as unknown as Record<string, unknown>;
  const metadata =
    record.metadata && typeof record.metadata === 'object' && !Array.isArray(record.metadata)
      ? (record.metadata as Record<string, unknown>)
      : null;

  for (const field of fieldNames) {
    const top = record[field];
    if (typeof top === 'string' && top.trim()) {
      return top.trim();
    }
    const nested = metadata?.[field];
    if (typeof nested === 'string' && nested.trim()) {
      return nested.trim();
    }
  }
  return '';
}

export function communityEventToFeedEvent(event: Event, thumbnailFallback: string): FeedEvent {
  const startsAt = pickIsoDate(event, ['startsAt', 'startAt', 'startTime', 'start', 'date']);
  const endsAt = pickIsoDate(event, ['endsAt', 'endAt', 'endTime', 'end']);
  const parsedStart = startsAt ? new Date(startsAt) : null;
  const date =
    parsedStart && !Number.isNaN(parsedStart.getTime())
      ? parsedStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      : '';

  return {
    id: event.id,
    title: event.title,
    date,
    time: formatEventTimeRange(startsAt, endsAt),
    thumbnail: thumbnailFallback,
    participants: [],
    participantsCount: 0,
  };
}

export function scheduledCommunityEventsToFeedEvents(events: Event[], thumbnailFallback: string): FeedEvent[] {
  return events
    .filter((event) => event.status === 'scheduled')
    .map((event) => communityEventToFeedEvent(event, thumbnailFallback));
}
