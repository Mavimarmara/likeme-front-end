import apiClient from '../infrastructure/apiClient';
import type { JoinEventApiResponse, ListEventsApiResponse } from '@/types/event';
import { getReadableErrorMessage } from '@/utils/error/readableErrorMessage';

class EventService {
  private readonly eventsEndpoint = '/api/community-events';

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

  async requestZoomJoinPayload(externalUrl: string): Promise<JoinEventApiResponse> {
    try {
      return await apiClient.post<JoinEventApiResponse>(`${this.eventsEndpoint}/join-payload`, { externalUrl }, true);
    } catch (error) {
      return {
        success: false,
        message: getReadableErrorMessage(error, 'Erro ao obter dados do evento'),
      };
    }
  }
}

export default new EventService();
