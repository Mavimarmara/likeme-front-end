import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurCard } from '@/components/ui/cards';
import { styles } from './styles';
import type { Event } from '@/types/event';

type Props = {
  event: Event;
  onPress?: (event: Event) => void;
  onSave?: (event: Event) => void;
};

const EventCard: React.FC<Props> = ({ event, onPress, onSave }) => {
  const renderAvatars = () => {
    const visibleParticipants = event.participants.slice(0, 3);
    const remainingCount = Math.max(0, event.participantsCount - visibleParticipants.length);

    return (
      <View style={styles.avatarsContainer}>
        {visibleParticipants.map((participant, index) => (
          <View key={participant.id} style={[styles.avatarWrapper, index > 0 && styles.avatarOverlap]}>
            {participant.avatar ? (
              <Image source={{ uri: participant.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{participant.name?.charAt(0).toUpperCase() || 'A'}</Text>
              </View>
            )}
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={[styles.avatarWrapper, styles.avatarOverlap]}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>+{remainingCount}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const formatDateTime = () => {
    return `${event.date} ${event.time}`;
  };

  const topSection = (
    <View style={styles.topSectionContent}>
      {renderAvatars()}

      <TouchableOpacity style={styles.saveButton} onPress={() => onSave?.(event)} activeOpacity={0.7}>
        <Icon name='bookmark-border' size={18} color='#001137' />
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  const footerSection = {
    component: (
      <>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatDateTime()}</Text>
        </View>
      </>
    ),
  };

  return (
    <BlurCard
      backgroundImage={event.thumbnail}
      topSection={topSection}
      footerSection={footerSection}
      onPress={() => onPress?.(event)}
      style={styles.cardContainer}
    />
  );
};

export default EventCard;
