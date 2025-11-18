import apiClient from './apiClient';

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

class PostsService {
  private readonly endpoint = '/api/communities/user/me/posts';

  async getPosts(params: GetPostsParams = {}): Promise<ApiPostsResponse> {
    try {
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

      const response = await apiClient.get<ApiPostsResponse>(
        this.endpoint,
        queryParams,
        true,
        false
      );

      return response;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }
}

export default new PostsService();

