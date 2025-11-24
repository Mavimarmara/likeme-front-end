import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  UserFeedApiResponse,
  UserFeedParams,
} from '@/types/community';

class CommunityService {
  private readonly userFeeEndpoint = '/api/communities/feed';
  private readonly pollDetailEndpoint = '/api/v3/polls';
  private readonly commentReactionEndpoint = '/api/communities/comments';

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

  async getPollDetail(pollId: string): Promise<any> {
    try {
      if (!pollId || pollId.trim() === '') {
        throw new Error('Poll ID is required');
      }

      const endpoint = `${this.pollDetailEndpoint}/${pollId.trim()}`;
      
      const pollResponse = await apiClient.get<any>(
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

  async votePoll(pollId: string, answerIds: string[]): Promise<any> {
    try {
      if (!pollId || pollId.trim() === '') {
        throw new Error('Poll ID is required');
      }

      if (!answerIds || answerIds.length === 0) {
        throw new Error('At least one answer ID is required');
      }

      // Endpoint fixo, pollId vai no body
      const endpoint = `/api/communities/polls/${pollId.trim()}/votes`;
      
      const voteResponse = await apiClient.put<any>(
        endpoint,
        { 
          pollId: pollId.trim(),
          answerIds 
        },
        true
      );

      logger.debug('Poll vote response:', {
        pollId,
        answerIds,
        success: !!voteResponse,
      });

      return voteResponse;
    } catch (error) {
      logger.error('Error voting on poll:', error);
      throw error;
    }
  }

  async addCommentReaction(commentId: string, reactionName: 'like' | 'dislike' = 'like'): Promise<boolean> {
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
        true
      );

      logger.debug('Comment reaction added:', { commentId, reactionName });
      return true;
    } catch (error) {
      logger.warn('Error adding comment reaction (ignored):', error);
      return false;
    }
  }

  async removeCommentReaction(commentId: string, reactionName: 'like' | 'dislike' = 'like'): Promise<boolean> {
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
        true
      );

      logger.debug('Comment reaction removed:', { commentId, reactionName });
      return true;
    } catch (error) {
      logger.warn('Error removing comment reaction (ignored):', error);
      return false;
    }
  }
}

export default new CommunityService();

