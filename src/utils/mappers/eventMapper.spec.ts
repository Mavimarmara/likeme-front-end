/**
 * Testes unitários para eventMapper
 *
 * Documenta como channels são mapeados para eventos,
 * incluindo tratamento de metadados e valores padrão.
 */

import { mapChannelsToEvents } from './eventMapper';
import type { Channel } from '@/types/community';
import type { Event } from '@/types/event';

describe('eventMapper', () => {
  const mockChannel: Channel = {
    channelId: 'channel-1',
    displayName: 'Test Channel',
    avatarFileId: 'avatar-1',
    metadata: {
      title: 'Test Event',
      date: '25 Dec',
      time: '14:30 pm',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      participants: [],
      participantsCount: 10,
    },
  };

  describe('mapChannelsToEvents', () => {
    it('deve mapear channel para event corretamente', () => {
      const result = mapChannelsToEvents([mockChannel]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'channel-1',
        title: 'Test Event',
        date: '25 Dec',
        time: '14:30 pm',
        thumbnail: 'https://example.com/thumbnail.jpg',
        participants: [],
        participantsCount: 10,
      });
    });

    it('deve usar displayName como title quando metadata.title não existe', () => {
      const channelWithoutTitle = {
        ...mockChannel,
        metadata: { ...mockChannel.metadata, title: undefined },
      };
      const result = mapChannelsToEvents([channelWithoutTitle]);

      expect(result[0].title).toBe('Test Channel');
    });

    it('deve usar "Event" como title padrão quando displayName também não existe', () => {
      const channelWithoutName = {
        ...mockChannel,
        displayName: undefined,
        metadata: { ...mockChannel.metadata, title: undefined },
      };
      const result = mapChannelsToEvents([channelWithoutName]);

      expect(result[0].title).toBe('Event');
    });

    it('deve gerar data padrão quando metadata.date não existe', () => {
      const channelWithoutDate = {
        ...mockChannel,
        metadata: { ...mockChannel.metadata, date: undefined },
      };
      const result = mapChannelsToEvents([channelWithoutDate]);

      // Aceita ambos os formatos: "25 Dec" ou "Dec 25"
      expect(result[0].date).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2})/);
    });

    it('deve usar time ou startTime do metadata', () => {
      const channelWithStartTime = {
        ...mockChannel,
        metadata: {
          ...mockChannel.metadata,
          time: undefined,
          startTime: '15:00 pm',
        },
      };
      const result = mapChannelsToEvents([channelWithStartTime]);

      expect(result[0].time).toBe('15:00 pm');
    });

    it('deve usar "08:00 am" como time padrão', () => {
      const channelWithoutTime = {
        ...mockChannel,
        metadata: {
          ...mockChannel.metadata,
          time: undefined,
          startTime: undefined,
        },
      };
      const result = mapChannelsToEvents([channelWithoutTime]);

      expect(result[0].time).toBe('08:00 am');
    });

    it('deve usar thumbnailUrl quando disponível', () => {
      const result = mapChannelsToEvents([mockChannel]);
      expect(result[0].thumbnail).toBe('https://example.com/thumbnail.jpg');
    });

    it('deve usar placeholder quando thumbnailUrl não existe e avatarFileId não existe', () => {
      const channelWithoutThumbnail = {
        ...mockChannel,
        avatarFileId: undefined,
        metadata: {
          ...mockChannel.metadata,
          thumbnailUrl: undefined,
        },
      };
      const result = mapChannelsToEvents([channelWithoutThumbnail]);

      expect(result[0].thumbnail).toBe(
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
      );
    });

    it('deve usar participantsCount quando disponível', () => {
      const result = mapChannelsToEvents([mockChannel]);
      expect(result[0].participantsCount).toBe(10);
    });

    it('deve usar length de participants quando participantsCount não existe', () => {
      const channelWithParticipants = {
        ...mockChannel,
        metadata: {
          ...mockChannel.metadata,
          participants: [{ id: '1' }, { id: '2' }] as any,
          participantsCount: undefined,
        },
      };
      const result = mapChannelsToEvents([channelWithParticipants]);

      expect(result[0].participantsCount).toBe(2);
    });

    it('deve usar 0 como participantsCount padrão', () => {
      const channelWithoutParticipants = {
        ...mockChannel,
        metadata: {
          ...mockChannel.metadata,
          participants: undefined,
          participantsCount: undefined,
        },
      };
      const result = mapChannelsToEvents([channelWithoutParticipants]);

      expect(result[0].participantsCount).toBe(0);
    });

    it('deve mapear múltiplos channels', () => {
      const channels = [mockChannel, { ...mockChannel, channelId: 'channel-2' }];
      const result = mapChannelsToEvents(channels);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('channel-1');
      expect(result[1].id).toBe('channel-2');
    });

    it('deve lidar com channel sem metadata', () => {
      const channelWithoutMetadata = {
        ...mockChannel,
        metadata: undefined,
      };
      const result = mapChannelsToEvents([channelWithoutMetadata]);

      expect(result[0].title).toBe('Test Channel');
      expect(result[0].participants).toEqual([]);
      expect(result[0].participantsCount).toBe(0);
    });
  });
});
