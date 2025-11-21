import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { EventCard } from '@/components/ui/community';
import type { Event } from '@/types/event';
import { styles } from './styles';

type Props = {
  events: Event[];
  onEventPress?: (event: Event) => void;
  onEventSave?: (event: Event) => void;
};

const NextEventsSection: React.FC<Props> = ({
  events,
  onEventPress,
  onEventSave,
}) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next Events</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={onEventPress}
            onSave={onEventSave}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default NextEventsSection;

