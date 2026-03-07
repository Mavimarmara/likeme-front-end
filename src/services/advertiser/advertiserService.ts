import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { GetAdvertiserApiResponse } from '@/types/ad';

class AdvertiserService {
  private readonly advertisersEndpoint = '/api/advertisers';

  async getAdvertiserById(advertiserId: string): Promise<GetAdvertiserApiResponse> {
    try {
      if (!advertiserId || advertiserId.trim() === '') {
        throw new Error('Advertiser ID is required');
      }

      const endpoint = `${this.advertisersEndpoint}/${advertiserId.trim()}`;

      const response = await apiClient.get<GetAdvertiserApiResponse>(endpoint, undefined, true, false);

      logger.debug('Advertiser detail response:', {
        advertiserId,
        success: response.success,
        hasData: !!response.data,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching advertiser detail:', error);
      throw error;
    }
  }
}

export default new AdvertiserService();
