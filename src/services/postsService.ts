import apiClient from './apiClient';

export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  commentsCount: number;
  createdAt?: string;
}

export interface PaginatedPostsResponse {
  data: Post[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

class PostsService {
  private readonly endpoint = '/api/v1/posts';

  async getPosts(params: GetPostsParams = {}): Promise<PaginatedPostsResponse> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }
      
      if (params.pageSize !== undefined) {
        queryParams.pageSize = String(params.pageSize);
      }
      
      if (params.search) {
        queryParams.search = params.search;
      }
      
      if (params.category) {
        queryParams.category = params.category;
      }

      const response = await apiClient.get<PaginatedPostsResponse>(
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

