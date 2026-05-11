import apiClient from '../infrastructure/apiClient';
import type {
  ListEventsApiResponse,
  RegisterScheduledCommunityEventReminderApiResponse,
  ScheduledCommunityEventRemindersListApiResponse,
} from '@/types/event';
import { getReadableErrorMessage } from '@/utils/error/readableErrorMessage';
import { logger } from '@/utils/logger';

export type RegisterScheduledCommunityEventReminderPayload = {
  eventId: string;
  title: string;
  startsAt: string;
  communityId?: string;
};

class EventService {
  private readonly eventsEndpoint = '/api/community-events';

  async listScheduledCommunityEventReminderIds(): Promise<string[]> {
    try {
      const res = await apiClient.get<ScheduledCommunityEventRemindersListApiResponse>(
        `${this.eventsEndpoint}/reminders`,
        undefined,
        true,
        false,
      );
      const ids = res.data?.eventIds;
      return Array.isArray(ids) ? ids : [];
    } catch (error) {
      logger.warn('[EventService] Falha ao listar lembretes de eventos da comunidade', { cause: error });
      return [];
    }
  }

  async registerScheduledCommunityEventReminder(
    payload: RegisterScheduledCommunityEventReminderPayload,
  ): Promise<RegisterScheduledCommunityEventReminderApiResponse> {
    return apiClient.post<RegisterScheduledCommunityEventReminderApiResponse>(
      `${this.eventsEndpoint}/reminders`,
      {
        eventId: payload.eventId,
        title: payload.title,
        startsAt: payload.startsAt,
        ...(payload.communityId ? { communityId: payload.communityId } : {}),
      },
      true,
    );
  }

  async unregisterScheduledCommunityEventReminder(eventId: string): Promise<void> {
    const encoded = encodeURIComponent(eventId);
    await apiClient.delete(`${this.eventsEndpoint}/reminders/${encoded}`, undefined, true);
  }

  async listEvents(communityId?: string): Promise<ListEventsApiResponse> {
    const params =
      typeof communityId === 'string' && communityId.trim().length > 0
        ? { communityId: communityId.trim() }
        : undefined;
    try {
      return await apiClient.get<ListEventsApiResponse>(this.eventsEndpoint, params, true, false);
    } catch (error) {
      return {
        success: false,
        message: getReadableErrorMessage(error, 'Erro ao listar eventos'),
      };
    }
  }
}

export default new EventService();
