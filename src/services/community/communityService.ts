import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  UserFeedApiResponse,
  UserFeedParams,
  ListCommunitiesParams,
  ListCommunitiesApiResponse,
  ChannelsApiResponse,
  GetChannelsParams,
} from '@/types/community';

class CommunityService {
  private readonly userFeeEndpoint = '/api/communities/feed';
  private readonly pollDetailEndpoint = '/api/v3/polls';
  private readonly commentReactionEndpoint = '/api/communities/comments';
  private readonly communitiesEndpoint = '/api/communities';
  private readonly channelsEndpoint = '/api/communities/channels';

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

      const userFeedResponse = await apiClient.get<UserFeedApiResponse>(
        this.userFeeEndpoint,
        queryParams,
        true,
        false,
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

      const pollResponse = await apiClient.get<any>(endpoint, undefined, true, false);

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
          answerIds,
        },
        true,
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

  async addCommentReaction(
    commentId: string,
    reactionName: 'like' | 'dislike' = 'like',
  ): Promise<boolean> {
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

  async removeCommentReaction(
    commentId: string,
    reactionName: 'like' | 'dislike' = 'like',
  ): Promise<boolean> {
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

  async getChannels(params: GetChannelsParams = {}): Promise<ChannelsApiResponse> {
    try {
      const queryParams: Record<string, string> = {};

      if (params.types) {
        if (Array.isArray(params.types)) {
          queryParams.types = params.types.join(',');
        } else {
          queryParams.types = params.types;
        }
      }

      const channelsResponse = await apiClient.get<ChannelsApiResponse>(
        this.channelsEndpoint,
        queryParams,
        true,
        false,
      );

      logger.debug('Channels response:', {
        types: params.types,
        success: channelsResponse.success,
        hasData: !!channelsResponse.data,
        channelsCount: channelsResponse.data?.channels?.length || 0,
      });

      return channelsResponse;
    } catch (error) {
      logger.error('Error fetching channels:', error);
      throw error;
    }
  }
}

export default new CommunityService();
