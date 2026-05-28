import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, type ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { useTranslation } from '@/hooks/i18n';
import type { Event } from '@/types/event';
import { communityEventToFeedEvent } from '@/utils/event/communityEventToFeedEvent';
import { styles } from './styles';

export type ProgramLessonPreview = {
  id: string;
  title: string;
};

type Props = {
  coverImageUri: string;
  upcomingLesson?: ProgramLessonPreview | null;
  nextEvent?: Event | null;
  hostName?: string | null;
  onLessonPress?: (lesson: ProgramLessonPreview) => void;
  onEventPress?: () => void;
};

const ProgramContentHighlightsRow: React.FC<Props> = ({
  coverImageUri,
  upcomingLesson,
  nextEvent,
  hostName,
  onLessonPress,
  onEventPress,
}) => {
  const { t } = useTranslation();

  const lessonBadgeLabel = upcomingLesson
    ? upcomingLesson.title
    : t('profile.protocolDetail.comingSoon', { defaultValue: 'Em breve' });

  const eventHost = hostName?.trim() || t('profile.protocolDetail.defaultHost', { defaultValue: 'especialista' });
  const eventMessage = useMemo(() => {
    const title = nextEvent?.title?.trim();
    if (title) {
      return title;
    }
    return t('profile.protocolDetail.nextLiveHint', {
      host: eventHost,
      defaultValue: `Fique atento para a próxima sessão do ${eventHost}.`,
    });
  }, [eventHost, nextEvent, t]);

  const liveLabel = useMemo(() => {
    if (!nextEvent) {
      return null;
    }
    const feedEvent = communityEventToFeedEvent(nextEvent, coverImageUri);
    if (feedEvent.date && feedEvent.time) {
      const timePart = feedEvent.time.includes(' - ') ? feedEvent.time.split(' - ')[0] : feedEvent.time;
      return `Live ${feedEvent.date} - ${timePart}`;
    }
    if (feedEvent.date) {
      return `Live ${feedEvent.date}`;
    }
    return feedEvent.time ? `Live ${feedEvent.time}` : 'Live';
  }, [coverImageUri, nextEvent]);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.lessonCard}
        activeOpacity={upcomingLesson ? 0.85 : 1}
        disabled={!upcomingLesson}
        onPress={() => {
          if (upcomingLesson) {
            onLessonPress?.(upcomingLesson);
          }
        }}
        accessibilityRole={upcomingLesson ? 'button' : 'image'}
        accessibilityLabel={
          upcomingLesson
            ? t('profile.protocolDetail.openLesson', {
                title: upcomingLesson.title,
                defaultValue: `Abrir ${upcomingLesson.title}`,
              })
            : lessonBadgeLabel
        }
      >
        <CachedImage
          source={coverImageUri as ImageSourcePropType}
          style={styles.lessonImage}
          recyclingKey={upcomingLesson?.id ?? 'program-content-lesson-cover'}
        />
        <View style={styles.lessonOverlay}>
          <View style={styles.lessonBadge}>
            <Text style={styles.lessonBadgeText} numberOfLines={2}>
              {lessonBadgeLabel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={onEventPress ? 0.85 : 1}
        disabled={!onEventPress}
        onPress={onEventPress}
        accessibilityRole={onEventPress ? 'button' : 'text'}
      >
        <View style={styles.eventContent}>
          <View style={styles.eventTextBlock}>
            <Icon name='videocam' size={24} color='#001137' />
            <Text style={styles.eventMessage}>{eventMessage}</Text>
          </View>
          {liveLabel ? <Text style={styles.eventLiveLabel}>{liveLabel}</Text> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProgramContentHighlightsRow;
