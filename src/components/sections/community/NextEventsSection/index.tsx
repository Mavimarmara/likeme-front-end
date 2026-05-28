import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { EventCard } from '@/components/sections/community';
import type { FeedEvent } from '@/types/event';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = {
  events: FeedEvent[];
  title?: string;
  onEventPress?: (event: FeedEvent) => void;
  onEventSave?: (event: FeedEvent) => void;
};

const NextEventsSection: React.FC<Props> = ({ events, title, onEventPress, onEventSave }) => {
  const { t } = useTranslation();
  if (!events || events.length === 0) {
    return null;
  }

  const sectionTitle = title ?? t('home.nextEvents');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sectionTitle}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} onPress={onEventPress} onSave={onEventSave} />
        ))}
      </ScrollView>
    </View>
  );
};

export default NextEventsSection;
