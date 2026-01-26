import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { EventCard } from '@/components/sections/community';
import type { Event } from '@/types/event';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = {
  events: Event[];
  onEventPress?: (event: Event) => void;
  onEventSave?: (event: Event) => void;
};

const NextEventsSection: React.FC<Props> = ({ events, onEventPress, onEventSave }) => {
  const { t } = useTranslation();
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.nextEvents')}</Text>
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
