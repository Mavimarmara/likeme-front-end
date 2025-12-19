import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  Ad,
  ListAdsParams,
  ListAdsApiResponse,
  GetAdApiResponse,
  CreateAdData,
  UpdateAdData,
} from '@/types/ad';
import type { ApiResponse } from '@/types/infrastructure';

class AdService {
  private readonly adsEndpoint = '/api/ads';

  async listAds(params: ListAdsParams = {}): Promise<ListAdsApiResponse> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }
      
      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      if (params.advertiserId) {
        queryParams.advertiserId = params.advertiserId;
      }

      if (params.productId) {
        queryParams.productId = params.productId;
      }

      if (params.status) {
        queryParams.status = params.status;
      }

      if (params.category) {
        queryParams.category = params.category;
      }

      if (params.activeOnly !== undefined) {
        queryParams.activeOnly = String(params.activeOnly);
      }

      console.error('[AdService] Request URL:', `${this.adsEndpoint}?${new URLSearchParams(queryParams).toString()}`);
      console.error('[AdService] Query params:', JSON.stringify(queryParams, null, 2));
      
      const response = await apiClient.get<ListAdsApiResponse>(
        this.adsEndpoint,
        queryParams,
        true,
        false
      );

      console.error('[AdService] Response received:', {
        success: response.success,
        hasData: !!response.data,
        adsCount: response.data?.ads?.length || 0,
        pagination: response.data?.pagination,
      });
      
      logger.debug('Ads list response:', {
        page: params.page,
        limit: params.limit,
        success: response.success,
        adsCount: response.data?.ads?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching ads list:', error);
      throw error;
    }
  }

  async getAdById(adId: string): Promise<GetAdApiResponse> {
    try {
      if (!adId || adId.trim() === '') {
        throw new Error('Ad ID is required');
      }

      const endpoint = `${this.adsEndpoint}/${adId.trim()}`;
      
      const response = await apiClient.get<GetAdApiResponse>(
        endpoint,
        undefined,
        true,
        false
      );

      logger.debug('Ad detail response:', {
        adId,
        success: response.success,
        hasData: !!response.data,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching ad detail:', error);
      throw error;
    }
  }

  async createAd(data: CreateAdData): Promise<ApiResponse<Ad>> {
    try {
      const response = await apiClient.post<ApiResponse<Ad>>(
        this.adsEndpoint,
        data,
        true
      );

      logger.debug('Ad created:', {
        adId: response.data?.id,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error creating ad:', error);
      throw error;
    }
  }

  async updateAd(adId: string, data: UpdateAdData): Promise<ApiResponse<Ad>> {
    try {
      if (!adId || adId.trim() === '') {
        throw new Error('Ad ID is required');
      }

      const endpoint = `${this.adsEndpoint}/${adId.trim()}`;
      
      const response = await apiClient.put<ApiResponse<Ad>>(
        endpoint,
        data,
        true
      );

      logger.debug('Ad updated:', {
        adId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error updating ad:', error);
      throw error;
    }
  }

  async deleteAd(adId: string): Promise<ApiResponse<null>> {
    try {
      if (!adId || adId.trim() === '') {
        throw new Error('Ad ID is required');
      }

      const endpoint = `${this.adsEndpoint}/${adId.trim()}`;
      
      const response = await apiClient.delete<ApiResponse<null>>(
        endpoint,
        undefined,
        true
      );

      logger.debug('Ad deleted:', {
        adId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error deleting ad:', error);
      throw error;
    }
  }
}

export default new AdService();
