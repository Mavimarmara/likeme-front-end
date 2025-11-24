import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { Poll } from '@/types';

type Props = {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  disabled?: boolean;
};

const PollCard: React.FC<Props> = ({ poll, onVote, disabled = false }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const preselected = poll.options.find((option: any) => option.isSelected)?.id;
    setSelectedOptionId(preselected ?? null);
  }, [poll]);
  const formatDate = (date: Date): string => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}. ${year}`;
  };

  const handleOptionPress = (optionId: string) => {
    if (disabled || poll.isFinished || !onVote) return;
    setSelectedOptionId(optionId);
    onVote(poll.id, optionId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {poll.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => handleOptionPress(option.id)}
            disabled={disabled || poll.isFinished}
            activeOpacity={disabled || poll.isFinished ? 1 : 0.7}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioButtonInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.text}
                </Text>
                </View>
                <Text
                  style={[
                    styles.percentage,
                    isSelected && styles.percentageSelected,
                  ]}
                >
                  {option.percentage}%
                </Text>
              </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground} />
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${option.percentage}%` },
                  isSelected && styles.progressBarFillSelected,
                ]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
      </View>

      {poll.isFinished && poll.endedAt && (
        <Text style={styles.footerText}>
          Poll finished {formatDate(poll.endedAt)}
        </Text>
      )}
    </View>
  );
};

export default PollCard;
