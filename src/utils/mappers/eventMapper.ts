import type { Channel } from '@/types/community';
import type { Event } from '@/types/event';

export const mapChannelsToEvents = (channels: Channel[]): Event[] => {
  return channels.map((channel) => {
    const metadata = channel.metadata || {};
    const date =
      (metadata.date as string) || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const time = (metadata.time as string) || (metadata.startTime as string) || '08:00 am';
    const thumbnail =
      (metadata.thumbnailUrl as string) ||
      (channel.avatarFileId ? undefined : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400') ||
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400';
    const participants = (metadata.participants as Event['participants']) || [];
    const participantsCount = (metadata.participantsCount as number) || participants.length || 0;

    return {
      id: channel.channelId,
      title: (metadata.title as string) || channel.displayName || 'Event',
      date,
      time,
      thumbnail,
      participants,
      participantsCount,
    };
  });
};
