import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { Event } from '@/types/event';
import { BlurView } from 'expo-blur';

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
          <View
            key={participant.id}
            style={[
              styles.avatarWrapper,
              index > 0 && styles.avatarOverlap,
            ]}
          >
            {participant.avatar ? (
              <Image
                source={{ uri: participant.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {participant.name?.charAt(0).toUpperCase() || 'A'}
                </Text>
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(event)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.thumbnail }}
        style={styles.backgroundImage}
      />
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          {renderAvatars()}
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave?.(event)}
            activeOpacity={0.7}
          >
            <Icon name="bookmark-border" size={18} color="#001137" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          <BlurView intensity={30} tint="dark" style={styles.bottomBlur} />
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{formatDateTime()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;

