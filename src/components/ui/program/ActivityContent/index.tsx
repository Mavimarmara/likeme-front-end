import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { ProgramActivity } from '@/types/program';

type Props = {
  activity: ProgramActivity;
};

const ActivityContent: React.FC<Props> = ({ activity }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionPress = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{activity.question}</Text>
        <View style={styles.checkContainer}>
          <View style={styles.checkCircle} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Icon name="edit" size={18} color="#001137" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.question}>{activity.question}</Text>
        </View>

        {activity.options && (
          <View style={styles.optionsGrid}>
            {activity.options.map((option, index) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleOptionPress(option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            activity.isSubmitted && styles.submitButtonSubmitted,
          ]}
          activeOpacity={0.7}
          disabled={activity.isSubmitted}
        >
          <Text
            style={[
              styles.submitButtonText,
              activity.isSubmitted && styles.submitButtonTextSubmitted,
            ]}
          >
            {activity.isSubmitted ? 'Submitted' : 'Submit'}
          </Text>
          {activity.isSubmitted && (
            <Icon name="send" size={24} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityContent;

