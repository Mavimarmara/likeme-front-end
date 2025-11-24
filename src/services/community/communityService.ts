import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  UserFeedApiResponse,
  UserFeedParams,
  PollDetailApiResponse,
} from '@/types/community';

class CommunityService {
  private readonly userFeeEndpoint = '/api/communities/feed';
  private readonly pollDetailEndpoint = '/api/v3/polls';

  async getUserFeed(params: UserFeedParams = {}): Promise<UserFeedApiResponse> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }
      
      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      if (params.search && params.search.trim() !== '') {
        queryParams.search = params.search.trim();
      }

      const userFeedResponse = await apiClient.get<UserFeedApiResponse>(
        this.userFeeEndpoint,
        queryParams,
        true,
        false
      );
console.log('userFeedResponse', JSON.stringify(userFeedResponse));
      return userFeedResponse;
    } catch (error) {
      logger.error('Error fetching user feed:', error);
      throw error;
    }
  }

  async getPollDetail(pollId: string): Promise<PollDetailApiResponse> {
    try {
      if (!pollId || pollId.trim() === '') {
        throw new Error('Poll ID is required');
      }

      const endpoint = `${this.pollDetailEndpoint}/${pollId.trim()}`;
      
      const pollResponse = await apiClient.get<PollDetailApiResponse>(
        endpoint,
        undefined,
        true,
        false
      );

      logger.debug('Poll detail response:', {
        pollId,
        success: pollResponse.success,
        hasData: !!pollResponse.data,
        hasPoll: !!pollResponse.poll,
      });

      return pollResponse;
    } catch (error) {
      logger.error('Error fetching poll detail:', error);
      throw error;
    }
  }
}

export default new CommunityService();

