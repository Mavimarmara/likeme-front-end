import { scheduledCommunityEventsToFeedEvents } from '@/utils/event/communityEventToFeedEvent';
import type { Event } from '@/types/event';

describe('scheduledCommunityEventsToFeedEvents', () => {
  it('retorna apenas eventos com status scheduled', () => {
    const events: Event[] = [
      {
        id: 'e1',
        title: 'Sessão ao vivo',
        status: 'live',
        provider: 'zoom',
        source: 'social_plus',
      },
      {
        id: 'e2',
        title: 'Encontro semanal',
        status: 'scheduled',
        startsAt: '2026-06-01T15:00:00.000Z',
        endsAt: '2026-06-01T16:00:00.000Z',
        provider: 'zoom',
        source: 'social_plus',
      },
    ];

    const feedEvents = scheduledCommunityEventsToFeedEvents(events, 'https://example.com/thumb.jpg');

    expect(feedEvents).toHaveLength(1);
    expect(feedEvents[0]?.id).toBe('e2');
    expect(feedEvents[0]?.title).toBe('Encontro semanal');
  });
});
