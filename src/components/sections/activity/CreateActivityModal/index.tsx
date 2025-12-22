import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput as RNTextInput, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ModalBase } from '@/components/ui/modals/shared';
import { SecondaryButton, PrimaryButton } from '@/components/ui/buttons';
import { Badge } from '@/components/ui';
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
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [startTimeValue, setStartTimeValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [endTimeValue, setEndTimeValue] = useState(new Date());
  const [location, setLocation] = useState('Vibre Saúde, Pinheiros, 142');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(5);
  
  // Picker visibility states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Format date for display
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}.`;
  };

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const startDate = formatDate(startDateValue);
  const startTime = formatTime(startTimeValue);
  const endDate = formatDate(endDateValue);
  const endTime = formatTime(endTimeValue);

  const handleSave = () => {
    onSave({
      name,
      type,
      startDate: startDateValue.toISOString().split('T')[0],
      startTime: formatTime(startTimeValue),
      endDate: endDateValue.toISOString().split('T')[0],
      endTime: formatTime(endTimeValue),
      location,
      reminderEnabled,
      reminderMinutes: reminderEnabled ? reminderMinutes : undefined,
    });
    onClose();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setStartDateValue(selectedDate);
      if (Platform.OS === 'ios') {
        setShowStartDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowStartDatePicker(false);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (event.type === 'set' && selectedTime) {
      setStartTimeValue(selectedTime);
      if (Platform.OS === 'ios') {
        setShowStartTimePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowStartTimePicker(false);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setEndDateValue(selectedDate);
      if (Platform.OS === 'ios') {
        setShowEndDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowEndDatePicker(false);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (event.type === 'set' && selectedTime) {
      setEndTimeValue(selectedTime);
      if (Platform.OS === 'ios') {
        setShowEndTimePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowEndTimePicker(false);
    }
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
        <View style={styles.divider} />

        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeFieldContainer}>
            <SecondaryButton
              label={startDate}
              onPress={() => setShowStartDatePicker(true)}
              variant="dark"
              icon="calendar-today"
              iconPosition="left"
              iconSize={16}
            />
            {showStartDatePicker && (
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <Modal
                    transparent
                    visible={showStartDatePicker}
                    animationType="slide"
                    onRequestClose={() => setShowStartDatePicker(false)}
                  >
                    <TouchableOpacity
                      style={styles.pickerOverlay}
                      activeOpacity={1}
                      onPress={() => setShowStartDatePicker(false)}
                    >
                      <View style={styles.pickerContent}>
                        <DateTimePicker
                          value={startDateValue}
                          mode="date"
                          display="spinner"
                          onChange={handleStartDateChange}
                          style={styles.picker}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={startDateValue}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.dateTimeFieldContainer}>
            <SecondaryButton
              label={`Starts – ${startTime}`}
              onPress={() => setShowStartTimePicker(true)}
              variant="dark"
            />
            {showStartTimePicker && (
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <Modal
                    transparent
                    visible={showStartTimePicker}
                    animationType="slide"
                    onRequestClose={() => setShowStartTimePicker(false)}
                  >
                    <TouchableOpacity
                      style={styles.pickerOverlay}
                      activeOpacity={1}
                      onPress={() => setShowStartTimePicker(false)}
                    >
                      <View style={styles.pickerContent}>
                        <DateTimePicker
                          value={startTimeValue}
                          mode="time"
                          display="spinner"
                          onChange={handleStartTimeChange}
                          style={styles.picker}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={startTimeValue}
                    mode="time"
                    display="default"
                    onChange={handleStartTimeChange}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeFieldContainer}>
            <SecondaryButton
              label={endDate}
              onPress={() => setShowEndDatePicker(true)}
              variant="dark"
              icon="calendar-today"
              iconPosition="left"
              iconSize={16}
            />
            {showEndDatePicker && (
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <Modal
                    transparent
                    visible={showEndDatePicker}
                    animationType="slide"
                    onRequestClose={() => setShowEndDatePicker(false)}
                  >
                    <TouchableOpacity
                      style={styles.pickerOverlay}
                      activeOpacity={1}
                      onPress={() => setShowEndDatePicker(false)}
                    >
                      <View style={styles.pickerContent}>
                        <DateTimePicker
                          value={endDateValue}
                          mode="date"
                          display="spinner"
                          onChange={handleEndDateChange}
                          style={styles.picker}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={endDateValue}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.dateTimeFieldContainer}>
            <SecondaryButton
              label={`Ends – ${endTime}`}
              onPress={() => setShowEndTimePicker(true)}
              variant="dark"
            />
            {showEndTimePicker && (
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <Modal
                    transparent
                    visible={showEndTimePicker}
                    animationType="slide"
                    onRequestClose={() => setShowEndTimePicker(false)}
                  >
                    <TouchableOpacity
                      style={styles.pickerOverlay}
                      activeOpacity={1}
                      onPress={() => setShowEndTimePicker(false)}
                    >
                      <View style={styles.pickerContent}>
                        <DateTimePicker
                          value={endTimeValue}
                          mode="time"
                          display="spinner"
                          onChange={handleEndTimeChange}
                          style={styles.picker}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                ) : (
                  <DateTimePicker
                    value={endTimeValue}
                    mode="time"
                    display="default"
                    onChange={handleEndTimeChange}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        <SecondaryButton
          label={`Location - ${location}`}
          onPress={() => {
            // TODO: Implement location picker
            console.log('Location pressed');
          }}
          variant="dark"
          style={styles.locationButton}
        />
        <View style={styles.divider} />

        <View style={styles.reminderContainer}>
          <View style={styles.reminderContent}>
            <Icon name="notifications" size={20} color="#001137" />
            <Text style={styles.reminderText}>{reminderMinutes} min after reminder</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#E0E0E0', true: '#0154f8' }}
              thumbColor="#FFFFFF"
            />
            <Text style={styles.switchLabel}>{reminderEnabled ? 'On' : 'Off'}</Text>
          </View>
        </View>
      </View>
    </ModalBase>
  );
};

export default CreateActivityModal;
