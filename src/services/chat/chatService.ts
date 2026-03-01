import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { ChannelsApiResponse, GetChannelsParams } from '@/types/community';

const CHANNELS_ENDPOINT = '/api/chat/channels';
const USERS_ENDPOINT = '/api/chat/users';

class ChatService {
  async getChannels(params: GetChannelsParams = {}): Promise<ChannelsApiResponse> {
    try {
      const queryParams: Record<string, string> = {};

      if (params.types) {
        queryParams.types = Array.isArray(params.types) ? params.types.join(',') : params.types;
      }

      const response = await apiClient.get<ChannelsApiResponse>(CHANNELS_ENDPOINT, queryParams, true, false);

      logger.debug('Channels response:', {
        types: params.types,
        success: response.success,
        channelsCount: response.data?.channels?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching channels:', error);
      throw error;
    }
  }

  async getChannelMessages(channelId: string, limit = 20): Promise<any> {
    try {
      if (!channelId || channelId.trim() === '') {
        throw new Error('Channel ID is required');
      }

      const endpoint = `${CHANNELS_ENDPOINT}/${channelId.trim()}/messages`;
      const queryParams: Record<string, string> = { limit: String(limit) };

      const response = await apiClient.get<any>(endpoint, queryParams, true, false);

      logger.debug('Channel messages response:', {
        channelId,
        success: response.success,
        messageCount: response.data?.messages?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching channel messages:', error);
      throw error;
    }
  }

  async sendMessage(channelId: string, text: string): Promise<any> {
    try {
      if (!channelId || channelId.trim() === '') {
        throw new Error('Channel ID is required');
      }
      if (!text || text.trim() === '') {
        throw new Error('Message text is required');
      }

      const endpoint = `${CHANNELS_ENDPOINT}/${channelId.trim()}/messages`;
      return await apiClient.post<any>(endpoint, { text: text.trim() }, true);
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  async leaveChannel(channelId: string): Promise<any> {
    try {
      if (!channelId || channelId.trim() === '') {
        throw new Error('Channel ID is required');
      }

      const endpoint = `${CHANNELS_ENDPOINT}/${channelId.trim()}/leave`;
      return await apiClient.delete<any>(endpoint, undefined, true);
    } catch (error) {
      logger.error('Error leaving channel:', error);
      throw error;
    }
  }

  async blockUser(targetUserId: string): Promise<any> {
    try {
      if (!targetUserId || targetUserId.trim() === '') {
        throw new Error('Target user ID is required');
      }

      const endpoint = `${USERS_ENDPOINT}/block`;
      return await apiClient.post<any>(endpoint, { targetUserId: targetUserId.trim() }, true);
    } catch (error) {
      logger.error('Error blocking user:', error);
      throw error;
    }
  }

  async unblockUser(targetUserId: string): Promise<any> {
    try {
      if (!targetUserId || targetUserId.trim() === '') {
        throw new Error('Target user ID is required');
      }

      const endpoint = `${USERS_ENDPOINT}/block/${targetUserId.trim()}`;
      return await apiClient.delete<any>(endpoint, undefined, true);
    } catch (error) {
      logger.error('Error unblocking user:', error);
      throw error;
    }
  }

  async getBlockedUsers(): Promise<any> {
    try {
      const endpoint = `${USERS_ENDPOINT}/blocked`;
      return await apiClient.get<any>(endpoint, undefined, true, false);
    } catch (error) {
      logger.error('Error fetching blocked users:', error);
      throw error;
    }
  }
}

export default new ChatService();
