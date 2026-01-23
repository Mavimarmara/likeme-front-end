import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { ProgramActivity } from '@/types/program';
import { SecondaryButton, PrimaryButton } from '@/components/ui/buttons';

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
        <Text style={styles.title}>{activity.title}</Text>
        <View style={styles.checkContainer}>
          <View style={styles.checkCircle} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <SecondaryButton label="Edit" onPress={() => {}} style={styles.editButton} />
          </View>
          <Text style={styles.question}>{activity.question}</Text>
        </View>

        {activity.options && (
          <View style={styles.optionsGrid}>
            {activity.options.map((option, index) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleOptionPress(option)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={styles.submitButtonContainer}>
          <PrimaryButton
            label={activity.isSubmitted ? 'Submitted' : 'Submit'}
            onPress={() => {}}
            style={styles.submitButton}
          />
        </View>
      </View>
    </View>
  );
};

export default ActivityContent;
