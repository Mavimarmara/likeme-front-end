import apiClient from './apiClient';

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  replies?: Comment[];
  replyToId?: string;
}

export interface PaginatedCommentsResponse {
  data: Comment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface GetCommentsParams {
  postId: string;
  page?: number;
  pageSize?: number;
  replyToId?: string;
}

class CommentsService {
  private readonly endpoint = '/api/v1/comments';

  async getComments(params: GetCommentsParams): Promise<PaginatedCommentsResponse> {
    try {
      const queryParams: Record<string, string> = {
        postId: params.postId,
      };
      
      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }
      
      if (params.pageSize !== undefined) {
        queryParams.pageSize = String(params.pageSize);
      }
      
      if (params.replyToId) {
        queryParams.replyToId = params.replyToId;
      }

      const response = await apiClient.get<PaginatedCommentsResponse>(
        this.endpoint,
        queryParams,
        true,
        false
      );

      return response;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async upvoteComment(commentId: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/${commentId}/upvote`, {}, true);
    } catch (error) {
      console.error('Error upvoting comment:', error);
      throw error;
    }
  }

  async downvoteComment(commentId: string): Promise<void> {
    try {
      await apiClient.post(`${this.endpoint}/${commentId}/downvote`, {}, true);
    } catch (error) {
      console.error('Error downvoting comment:', error);
      throw error;
    }
  }
}

export default new CommentsService();

