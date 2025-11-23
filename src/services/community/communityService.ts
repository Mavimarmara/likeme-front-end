import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  UserFeedApiResponse,
  UserFeedParams,
} from '@/types/community';

class CommunityService {
  private readonly userFeeEndpoint = '/api/communities/feed';

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
console.log('userFeedResponse', userFeedResponse);
      return userFeedResponse;
    } catch (error) {
      logger.error('Error fetching user feed:', error);
      throw error;
    }
  }
}

export default new CommunityService();

