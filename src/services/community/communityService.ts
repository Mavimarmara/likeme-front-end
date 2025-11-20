import apiClient from '../infrastructure/apiClient';

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

export interface CommunityPost {
  id: string;
  postId?: string;
  parentPostId?: string;
  userId?: string;
  userPublicId?: string;
  communityId?: string;
  data?: {
    text?: string;
    title?: string;
    fileId?: string;
    thumbnailFileId?: string;
  };
  reactionsCount?: number;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityFile {
  fileId?: string;
  fileUrl?: string;
  type?: string;
}

export interface CommunityUser {
  userId?: string;
  userPublicId?: string;
  displayName?: string;
  avatarFileId?: string;
  avatarCustomUrl?: string;
}

export interface CommunityFeedData {
  posts?: CommunityPost[];
  postChildren?: CommunityPost[];
  comments?: any[];
  users?: CommunityUser[];
  files?: CommunityFile[];
  communities?: any[];
  communityUsers?: any[];
  categories?: any[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export interface UserFeedApiResponse {
  success: boolean;
  status?: string;
  data?: CommunityFeedData;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface UserFeedParams {
  page?: number;
  limit?: number;
}

class CommunityService {
  private readonly userPostsEndpoint = '/api/communities/me/posts';
  private readonly publicPostsEndpoint = '/api/communities/feed';

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

  async getUserFeed(params: UserFeedParams = {}): Promise<UserFeedApiResponse> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }
      
      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      const userFeedResponse = await apiClient.get<UserFeedApiResponse>(
        this.publicPostsEndpoint,
        queryParams,
        true,
        false
      );

      return userFeedResponse;
    } catch (error) {
      console.error('Error fetching user feed:', error);
      throw error;
    }
  }

  async getPosts(params: GetPostsParams = {}): Promise<ApiPostsResponse> {
    return this.fetchPosts(this.userPostsEndpoint, params);
  }

  async getPublicPosts(params: GetPostsParams = {}): Promise<ApiPostsResponse> {
    return this.fetchPosts(this.publicPostsEndpoint, params);
  }
}

export default new CommunityService();

