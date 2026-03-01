import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { chatService } from '@/services';
import type { Channel } from '@/types/community';

export interface ChatConversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isProvider: boolean;
  showLogo: boolean;
}

function formatTimestamp(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return '1d';
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

function mapChannelToConversation(channel: Channel): ChatConversation {
  const metadata = channel.metadata || {};
  const ch = channel as any;

  return {
    id: channel.channelId,
    name: channel.displayName || (metadata.displayName as string) || '',
    avatar: (metadata.avatarUrl as string) || undefined,
    lastMessage: ch.lastMessagePreview || (metadata.lastMessage as string) || '',
    timestamp: formatTimestamp(ch.lastActivity || channel.updatedAt),
    unreadCount: ch.unreadCount || 0,
    isProvider: (metadata.isProvider as boolean) || false,
    showLogo: false,
  };
}

export interface UseChatOptions {
  searchQuery?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const { searchQuery = '' } = options;
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatService.getChannels({});
      if (response.success && response.data?.channels) {
        setChannels(response.data.channels);
      } else {
        setChannels([]);
      }
    } catch (err) {
      console.error('[useChat] Error loading channels:', err);
      setChannels([]);
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChannels();
    }, [loadChannels]),
  );

  const conversations = useMemo(() => {
    const mapped = channels.map(mapChannelToConversation);

    if (!searchQuery.trim()) return mapped;

    const query = searchQuery.toLowerCase();
    return mapped.filter((c) => c.name.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query));
  }, [channels, searchQuery]);

  return {
    conversations,
    loading,
    error,
    refresh: loadChannels,
  };
}
