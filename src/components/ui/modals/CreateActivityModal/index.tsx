import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput as RNTextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ModalBase } from '../shared';
import { SecondaryButton, PrimaryButton } from '@/components/ui/buttons';
import { styles } from './styles';

type ActivityType = 'task' | 'event';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    type: ActivityType;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    location?: string;
    reminderEnabled: boolean;
    reminderMinutes?: number;
  }) => void;
};

const CreateActivityModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ActivityType>('event');
  const [startDate, setStartDate] = useState('17 Oct.');
  const [startTime, setStartTime] = useState('8:00 am');
  const [endDate, setEndDate] = useState('17 Oct.');
  const [endTime, setEndTime] = useState('9:00 am');
  const [location, setLocation] = useState('Vibre Saúde, Pinheiros, 142');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(5);

  const handleSave = () => {
    onSave({
      name,
      type,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      reminderEnabled,
      reminderMinutes: reminderEnabled ? reminderMinutes : undefined,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      showTitle={false}
    >
      <View style={styles.header}>
        <SecondaryButton
          label="Cancel"
          onPress={handleCancel}
        />
        <PrimaryButton
          label="Save ↑"
          onPress={handleSave}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <RNTextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#999"
            style={styles.nameInput}
          />
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'task' && styles.typeButtonSelected]}
            onPress={() => setType('task')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeButtonText, type === 'task' && styles.typeButtonTextSelected]}>
              Task
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'event' && styles.typeButtonSelected]}
            onPress={() => setType('event')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeButtonText, type === 'event' && styles.typeButtonTextSelected]}>
              Event
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={styles.dateTimePill}
            onPress={() => {
              // TODO: Implement date picker
              console.log('Start date pressed');
            }}
            activeOpacity={0.7}
          >
            <Icon name="calendar-today" size={16} color="#001137" />
            <Text style={styles.dateTimeText}>{startDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateTimePill}
            onPress={() => {
              // TODO: Implement time picker
              console.log('Start time pressed');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeText}>Starts – {startTime}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={styles.dateTimePill}
            onPress={() => {
              // TODO: Implement date picker
              console.log('End date pressed');
            }}
            activeOpacity={0.7}
          >
            <Icon name="calendar-today" size={16} color="#001137" />
            <Text style={styles.dateTimeText}>{endDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateTimePill}
            onPress={() => {
              // TODO: Implement time picker
              console.log('End time pressed');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeText}>Ends – {endTime}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.locationPill}
          onPress={() => {
            // TODO: Implement location picker
            console.log('Location pressed');
          }}
          activeOpacity={0.7}
        >
          <Icon name="place" size={16} color="#001137" />
          <Text style={styles.locationText}>Location - {location}</Text>
        </TouchableOpacity>

        <View style={styles.reminderContainer}>
          <View style={styles.reminderContent}>
            <Icon name="notifications" size={20} color="#001137" />
            <Text style={styles.reminderText}>{reminderMinutes} min after reminder</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{reminderEnabled ? 'On' : 'Off'}</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#E0E0E0', true: '#0154f8' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>
    </ModalBase>
  );
};

export default CreateActivityModal;
