import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export interface EventReminderProps {
  message: string;
  date?: string;
  time?: string;
  onClose?: () => void;
  visible?: boolean;
}

export const EventReminder: React.FC<EventReminderProps> = ({
  message,
  date = 'Today',
  time,
  onClose,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Icon name="close" size={16} color="#001137" />
        </TouchableOpacity>
      )}
      <View style={styles.content}>
        <View style={styles.messageRow}>
          <View style={styles.iconButton}>
            <Icon name="notifications" size={24} color="#001137" />
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{date}</Text>
          {time && (
            <>
              <Text style={styles.separator}>-</Text>
              <Text style={styles.timeLabel}>Time</Text>
              <Text style={styles.timeValue}>{time}</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventReminder;
