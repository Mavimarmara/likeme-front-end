import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { ApiResponse } from '@/types/infrastructure';
import type {
  CommunityFeedData,
  UserFeedApiResponse,
  UserFeedParams,
  ListCommunitiesParams,
  ListCommunitiesApiResponse,
} from '@/types/community';

class CommunityService {
  private readonly userFeeEndpoint = '/api/communities/feed';
  private readonly pollsBasePath = '/api/communities/polls';
  private readonly commentReactionEndpoint = '/api/communities/comments';
  private readonly postReactionEndpoint = '/api/communities/posts';
  private readonly addCommentEndpoint = '/api/communities/comments';
  private readonly communitiesEndpoint = '/api/communities';

  async getUserFeed(params: UserFeedParams = {}): Promise<UserFeedApiResponse> {
    try {
      const queryParams: Record<string, string> = {};
      const formatListParam = (value?: string | string[]) => {
        if (!value) {
          return undefined;
        }
        if (Array.isArray(value)) {
          return value.filter((item) => item && item.trim().length > 0).join(',');
        }
        return value.trim();
      };

      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }

      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      if (params.search && params.search.trim() !== '') {
        queryParams.search = params.search.trim();
      }

      const postTypesParam = formatListParam(params.postTypes);
      if (postTypesParam) {
        queryParams.postTypes = postTypesParam;
      }

      const authorIdsParam = formatListParam(params.authorIds);
      if (authorIdsParam) {
        queryParams.authorIds = authorIdsParam;
      }

      if (params.startDate) {
        queryParams.startDate = params.startDate;
      }

      if (params.endDate) {
        queryParams.endDate = params.endDate;
      }

      if (params.orderBy) {
        queryParams.orderBy = params.orderBy;
      }

      if (params.order) {
        queryParams.order = params.order;
      }

      if (params.categoryId != null && params.categoryId !== '') {
        queryParams.categoryId = params.categoryId;
      }

      if (params.solutionIds != null && params.solutionIds.length > 0) {
        queryParams.solutionIds = params.solutionIds.join(',');
      }

      const userFeedResponse = await apiClient.get<UserFeedApiResponse>(this.userFeeEndpoint, queryParams, true, false);
      console.log('userFeedResponse', JSON.stringify(userFeedResponse));
      return userFeedResponse;
    } catch (error) {
      logger.error('Error fetching user feed:', error);
      throw error;
    }
  }

  async getPollDetail(pollId: string): Promise<unknown> {
    try {
      if (!pollId || pollId.trim() === '') {
        throw new Error('Poll ID is required');
      }

      const endpoint = `${this.pollsBasePath}/${encodeURIComponent(pollId.trim())}`;

      const pollResponse = await apiClient.get<ApiResponse<unknown>>(endpoint, undefined, true, false);

      logger.debug('Poll detail response:', {
        pollId,
        success: pollResponse.success,
        hasData: !!pollResponse.data,
      });

      if (!pollResponse.success) {
        throw new Error(pollResponse.message || 'Falha ao carregar enquete');
      }
      return pollResponse.data;
    } catch (error) {
      logger.error('Error fetching poll detail:', error);
      throw error;
    }
  }

  async getCommunityPostSnapshot(postId: string): Promise<CommunityFeedData> {
    if (!postId || postId.trim() === '') {
      throw new Error('Post ID is required');
    }
    const endpoint = `${this.postReactionEndpoint}/${encodeURIComponent(postId.trim())}`;
    const res = await apiClient.get<ApiResponse<CommunityFeedData>>(endpoint, undefined, true, false);
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Falha ao carregar o post');
    }
    return res.data;
  }

  async votePoll(pollId: string, answerIds: string[]): Promise<ApiResponse<unknown>> {
    try {
      if (!pollId || pollId.trim() === '') {
        throw new Error('Poll ID is required');
      }

      if (!answerIds || answerIds.length === 0) {
        throw new Error('At least one answer ID is required');
      }

      // Endpoint fixo, pollId vai no body
      const endpoint = `/api/communities/polls/${pollId.trim()}/votes`;

      const voteResponse = await apiClient.put<ApiResponse<unknown>>(
        endpoint,
        {
          pollId: pollId.trim(),
          answerIds,
        },
        true,
      );

      if (!voteResponse.success) {
        throw new Error(voteResponse.message || 'Falha ao registrar voto na enquete');
      }

      logger.debug('Poll vote response:', {
        pollId,
        answerIds,
        success: voteResponse.success,
      });

      return voteResponse;
    } catch (error) {
      logger.error('Error voting on poll:', error);
      throw error;
    }
  }

  async addPostReaction(postId: string, reactionName = 'like'): Promise<boolean> {
    try {
      if (!postId || postId.trim() === '') {
        throw new Error('Post ID is required');
      }

      const endpoint = `${this.postReactionEndpoint}/${postId.trim()}/reactions`;

      await apiClient.post(
        endpoint,
        {
          reactionName,
        },
        true,
      );

      logger.debug('Post reaction added:', { postId, reactionName });
      return true;
    } catch (error) {
      logger.warn('Error adding post reaction (ignored):', error);
      return false;
    }
  }

  async removePostReaction(postId: string, reactionName = 'like'): Promise<boolean> {
    try {
      if (!postId || postId.trim() === '') {
        throw new Error('Post ID is required');
      }

      const endpoint = `${this.postReactionEndpoint}/${postId.trim()}/reactions`;

      await apiClient.delete(
        endpoint,
        {
          reactionName,
        },
        true,
      );

      logger.debug('Post reaction removed:', { postId, reactionName });
      return true;
    } catch (error) {
      logger.warn('Error removing post reaction (ignored):', error);
      return false;
    }
  }

  async addCommentReaction(commentId: string, reactionName = 'like'): Promise<boolean> {
    try {
      if (!commentId || commentId.trim() === '') {
        throw new Error('Comment ID is required');
      }

      const endpoint = `${this.commentReactionEndpoint}/${commentId.trim()}/reactions`;

      await apiClient.post(
        endpoint,
        {
          reactionName,
        },
        true,
      );

      logger.debug('Comment reaction added:', { commentId, reactionName });
      return true;
    } catch (error) {
      logger.warn('Error adding comment reaction (ignored):', error);
      return false;
    }
  }

  async removeCommentReaction(commentId: string, reactionName = 'like'): Promise<boolean> {
    try {
      if (!commentId || commentId.trim() === '') {
        throw new Error('Comment ID is required');
      }

      const endpoint = `${this.commentReactionEndpoint}/${commentId.trim()}/reactions`;

      await apiClient.delete(
        endpoint,
        {
          reactionName,
        },
        true,
      );

      logger.debug('Comment reaction removed:', { commentId, reactionName });
      return true;
    } catch (error) {
      logger.warn('Error removing comment reaction (ignored):', error);
      return false;
    }
  }

  /**
   * Lista comentários por referência (post, content ou story).
   * Proxy: GET /api/communities/comments?referenceId=...&referenceType=...
   */
  async getCommentsByReference(
    referenceId: string,
    referenceType: 'post' | 'content' | 'story' = 'post',
  ): Promise<any> {
    const trimmedId = referenceId?.trim();
    if (!trimmedId) {
      throw new Error('referenceId é obrigatório para buscar comentários');
    }

    return apiClient.get<any>(this.commentReactionEndpoint, {
      referenceId: trimmedId,
      referenceType,
    });
  }

  async addPostComment(postId: string, text: string, parentId?: string): Promise<any> {
    try {
      if (!postId || postId.trim() === '') {
        throw new Error('Post ID is required');
      }

      const trimmedText = text?.trim();
      if (!trimmedText) {
        throw new Error('Text is required');
      }

      const response = await apiClient.post<any>(
        this.addCommentEndpoint,
        {
          postId: postId.trim(),
          text: trimmedText,
          referenceType: 'post',
          parentId,
        },
        true,
      );

      logger.debug('Post comment added:', { postId, hasParentId: !!parentId });
      return response;
    } catch (error) {
      logger.error('Error adding post comment:', error);
      throw error;
    }
  }

  async listCommunities(params: ListCommunitiesParams = {}): Promise<ListCommunitiesApiResponse> {
    try {
      const queryParams: Record<string, string> = {};

      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }

      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      if (params.sortBy) {
        queryParams.sortBy = params.sortBy;
      }

      if (params.includeDeleted !== undefined) {
        queryParams.includeDeleted = String(params.includeDeleted);
      }

      const communitiesResponse = await apiClient.get<ListCommunitiesApiResponse>(
        this.communitiesEndpoint,
        queryParams,
        true,
        false,
      );

      logger.debug('Communities list response:', {
        page: params.page,
        limit: params.limit,
        success: communitiesResponse.success,
        hasData: !!communitiesResponse.data,
      });

      return communitiesResponse;
    } catch (error) {
      logger.error('Error fetching communities list:', error);
      throw error;
    }
  }

  async joinCommunity(
    communityId: string,
  ): Promise<{ success: boolean; data?: { communityId: string; joined: boolean }; message?: string }> {
    try {
      if (!communityId || communityId.trim() === '') {
        throw new Error('Community ID is required');
      }

      const endpoint = `${this.communitiesEndpoint}/${communityId.trim()}/join`;
      const response = await apiClient.post<{
        success: boolean;
        data: { communityId: string; joined: boolean };
        message: string;
      }>(endpoint, undefined, true);

      logger.debug('Join community response:', { communityId, success: response.success });
      return response;
    } catch (error) {
      logger.error('Error joining community:', error);
      throw error;
    }
  }
}

export default new CommunityService();
