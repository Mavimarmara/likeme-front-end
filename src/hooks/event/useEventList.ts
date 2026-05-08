import { useCallback, useEffect, useState } from 'react';
import { eventService } from '@/services';
import type { Event } from '@/types/event';
import { logger } from '@/utils/logger';

export interface UseEventListOptions {
  enabled?: boolean;
  communityId?: string;
}

export interface UseEventListReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useEventList = (options: UseEventListOptions = {}): UseEventListReturn => {
  const { enabled = true, communityId } = options;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setEvents([]);
      return;
    }
    if (!communityId?.trim()) {
      setEvents([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await eventService.listEvents(communityId);
      const isSuccess = response.success === true || response.status === 'success';
      if (!isSuccess) {
        throw new Error(response.message || 'Erro ao carregar eventos');
      }
      const nextEvents = Array.isArray(response.data?.events) ? response.data!.events! : [];
      if (nextEvents.length > 0) {
        const first = nextEvents[0] as unknown as Record<string, unknown>;
        const metadata =
          first.metadata && typeof first.metadata === 'object' && !Array.isArray(first.metadata)
            ? (first.metadata as Record<string, unknown>)
            : null;
        logger.warn('[useEventList] Primeiro evento recebido (diagnóstico de horário)', {
          eventId: String(first.id ?? ''),
          eventKeys: Object.keys(first),
          startsAt: first.startsAt,
          endsAt: first.endsAt,
          startTime: first.startTime,
          endTime: first.endTime,
          metadataKeys: metadata ? Object.keys(metadata) : [],
          metadataStartTime: metadata?.startTime,
          metadataEndTime: metadata?.endTime,
        });
      } else {
        logger.warn('[useEventList] Nenhum evento retornado pela API');
      }
      setEvents(nextEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [communityId, enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { events, loading, error, refresh };
};
