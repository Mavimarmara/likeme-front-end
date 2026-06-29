import { toEventBanner } from '@/utils/event/toEventBanner';
import type { Event } from '@/types/event';

describe('toEventBanner', () => {
  const defaultParams = {
    loadEvents: true,
    communityAvatarUrl: null,
    defaultThumbnailUrl: 'https://example.com/default-thumb.jpg',
  };

  it('mapeia horário padrão via startsAt/endsAt', () => {
    const events: Event[] = [
      {
        id: 'event-1',
        title: 'Evento com startsAt',
        startsAt: '2026-05-08T10:00:00.000Z',
        endsAt: '2026-05-08T11:00:00.000Z',
        status: 'scheduled',
        provider: 'zoom',
        source: 'social_plus',
      },
    ];

    const banner = toEventBanner({ ...defaultParams, events });

    expect(banner).toEqual(
      expect.objectContaining({
        startTime: '2026-05-08T10:00:00.000Z',
        endTime: '2026-05-08T11:00:00.000Z',
      }),
    );
  });

  it('mapeia horário quando payload vem em campos alternativos (startTime/end_time)', () => {
    const events: Event[] = [
      {
        id: 'event-2',
        title: 'Evento com campos alternativos',
        status: 'scheduled',
        provider: 'zoom',
        source: 'social_plus',
      } as Event,
    ];

    (events[0] as unknown as Record<string, unknown>).startTime = '2026-05-08T12:00:00.000Z';
    (events[0] as unknown as Record<string, unknown>).end_time = '2026-05-08T13:30:00.000Z';

    const banner = toEventBanner({ ...defaultParams, events });

    expect(banner).toEqual(
      expect.objectContaining({
        startTime: '2026-05-08T12:00:00.000Z',
        endTime: '2026-05-08T13:30:00.000Z',
      }),
    );
  });

  it('mapeia horário quando payload vem dentro de metadata', () => {
    const events: Event[] = [
      {
        id: 'event-3',
        title: 'Evento com metadata',
        status: 'scheduled',
        provider: 'zoom',
        source: 'social_plus',
      } as Event,
    ];

    (events[0] as unknown as Record<string, unknown>).metadata = {
      startTime: '2026-05-08T14:00:00.000Z',
      end_time: '2026-05-08T15:45:00.000Z',
    };

    const banner = toEventBanner({ ...defaultParams, events });

    expect(banner).toEqual(
      expect.objectContaining({
        startTime: '2026-05-08T14:00:00.000Z',
        endTime: '2026-05-08T15:45:00.000Z',
      }),
    );
  });

  it('mapeia horário quando payload vem como timestamp numérico', () => {
    const startIso = '2026-05-08T14:00:00.000Z';
    const endIso = '2026-05-08T15:00:00.000Z';
    const startUnix = Math.floor(Date.parse(startIso) / 1000);
    const endUnix = Math.floor(Date.parse(endIso) / 1000);

    const events: Event[] = [
      {
        id: 'event-4',
        title: 'Evento com timestamp',
        status: 'scheduled',
        provider: 'zoom',
        source: 'social_plus',
      } as Event,
    ];

    (events[0] as unknown as Record<string, unknown>).start = startUnix;
    (events[0] as unknown as Record<string, unknown>).end = endUnix;

    const banner = toEventBanner({ ...defaultParams, events });

    expect(banner?.startTime).toBe(startIso);
    expect(banner?.endTime).toBe(endIso);
  });

  it('usa nome do provider da comunidade como host', () => {
    const events: Event[] = [
      {
        id: 'event-5',
        title: 'Evento com provider da comunidade',
        status: 'scheduled',
        provider: 'zoom',
        source: 'social_plus',
        displayHost: 'Like:Me',
      },
    ];

    const banner = toEventBanner({
      ...defaultParams,
      events,
      communityProviderName: 'Dr. Diogo',
    });

    expect(banner?.host).toBe('Dr. Diogo');
  });

  it('ignora evento encerrado quando a API retorna antes de um evento ativo', () => {
    const events: Event[] = [
      {
        id: 'event-ended',
        title: 'Evento encerrado',
        startsAt: '2026-05-08T10:00:00.000Z',
        endsAt: '2026-05-08T11:00:00.000Z',
        status: 'ended',
        provider: 'zoom',
        source: 'social_plus',
      },
      {
        id: 'event-live',
        title: 'Evento ao vivo',
        startsAt: '2026-05-08T12:00:00.000Z',
        endsAt: '2026-05-08T13:00:00.000Z',
        status: 'live',
        provider: 'zoom',
        source: 'social_plus',
      },
    ];

    const banner = toEventBanner({ ...defaultParams, events });

    expect(banner).toEqual(
      expect.objectContaining({
        id: 'event-live',
        title: 'Evento ao vivo',
        status: 'Live Now',
      }),
    );
  });

  it('não exibe banner quando só existem eventos encerrados ou com erro', () => {
    const events: Event[] = [
      {
        id: 'event-ended',
        title: 'Evento encerrado',
        status: 'ended',
        provider: 'zoom',
        source: 'social_plus',
      },
      {
        id: 'event-error',
        title: 'Evento indisponível',
        status: 'error',
        provider: 'zoom',
        source: 'social_plus',
      },
    ];

    const banner = toEventBanner({ ...defaultParams, events });

    expect(banner).toBeUndefined();
  });
});
