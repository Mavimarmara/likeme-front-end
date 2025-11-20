import apiClient from './apiClient';
import { GlobalFeedApiResponse, GlobalFeedParams } from '../types/amity';

// Manter interfaces antigas para compatibilidade (deprecated)
export interface Post {
  id: string;
  communityId: string;
  userId: string;
  content: string;
  media: string[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiPostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: Pagination;
  };
  message: string;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
}

class CommunityService {
  private readonly userPostsEndpoint = '/api/communities/me/posts';
  private readonly publicPostsEndpoint = '/api/communities/posts';

  private buildQueryParams(params: GetPostsParams = {}): Record<string, string> {
    const queryParams: Record<string, string> = {};

    if (params.page !== undefined) {
      queryParams.page = String(params.page);
    }

    if (params.limit !== undefined) {
      queryParams.limit = String(params.limit);
    }

    if (params.search) {
      queryParams.search = params.search;
    }

    return queryParams;
  }

  private async fetchPosts(
    endpoint: string,
    params: GetPostsParams = {}
  ): Promise<ApiPostsResponse> {
    try {
      const response = await apiClient.get<ApiPostsResponse>(
        endpoint,
        this.buildQueryParams(params),
        true,
        false
      );

      return response;
    } catch (error) {
      console.error('Error fetching community posts:', error);
      throw error;
    }
  }

  /**
   * Busca o feed global usando as interfaces do Amity
   * Retorna a estrutura completa com posts, comments, users, files, communities, etc.
   */
  async getGlobalFeed(params: GlobalFeedParams = {}): Promise<GlobalFeedApiResponse> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }
      
      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      const response = await apiClient.get<GlobalFeedApiResponse>(
        this.publicPostsEndpoint,
        queryParams,
        true,
        false
      );

      return response;
    } catch (error) {
      console.error('Error fetching global feed:', error);
      throw error;
    }
  }

  // Métodos antigos mantidos para compatibilidade (deprecated)
  async getPosts(params: GetPostsParams = {}): Promise<ApiPostsResponse> {
    return this.fetchPosts(this.userPostsEndpoint, params);
  }

  async getPublicPosts(params: GetPostsParams = {}): Promise<ApiPostsResponse> {
    return this.fetchPosts(this.publicPostsEndpoint, params);
  }
}

export default new CommunityService();

