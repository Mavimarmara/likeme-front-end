import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput as RNTextInput } from 'react-native';
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
      header={
        <View style={styles.header}>
          <SecondaryButton
            label="Cancel"
            onPress={handleCancel}
          />
          <PrimaryButton
            label="Save"
            onPress={handleSave}
            icon="arrow-upward"
            iconPosition="right"
          />
        </View>
      }
    >
      <View style={styles.content}>
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
          <SecondaryButton
            label="Task"
            onPress={() => setType('task')}
            style={[styles.typeButtonBase, type === 'task' && styles.typeButtonSelected]}
          />
          <SecondaryButton
            label="Event"
            onPress={() => setType('event')}
            style={[styles.typeButtonBase, type === 'event' && styles.typeButtonSelected]}
          />
        </View>

        <View style={styles.dateTimeRow}>
          <PrimaryButton
            label={startDate}
            onPress={() => {
              // TODO: Implement date picker
              console.log('Start date pressed');
            }}
            variant="light"
            icon="calendar-today"
            iconPosition="left"
            iconSize={16}
            style={styles.dateTimeButton}
          />
          <PrimaryButton
            label={`Starts – ${startTime}`}
            onPress={() => {
              // TODO: Implement time picker
              console.log('Start time pressed');
            }}
            variant="light"
            style={styles.dateTimeButton}
          />
        </View>

        <View style={styles.dateTimeRow}>
          <PrimaryButton
            label={endDate}
            onPress={() => {
              // TODO: Implement date picker
              console.log('End date pressed');
            }}
            variant="light"
            icon="calendar-today"
            iconPosition="left"
            iconSize={16}
            style={styles.dateTimeButton}
          />
          <PrimaryButton
            label={`Ends – ${endTime}`}
            onPress={() => {
              // TODO: Implement time picker
              console.log('End time pressed');
            }}
            variant="light"
            style={styles.dateTimeButton}
          />
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
      </View>
    </ModalBase>
  );
};

export default CreateActivityModal;
