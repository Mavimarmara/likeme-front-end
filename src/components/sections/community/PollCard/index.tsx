import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import type { Poll } from '@/types';

type Props = {
  poll: Poll;
  onVote?: (pollId: string, answerId: string) => void | Promise<void>;
  disabled?: boolean;
};

const PollCard: React.FC<Props> = ({ poll, onVote, disabled = false }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const preselected = poll.options.find((option) => option.isSelected)?.id;
    setSelectedOptionId(preselected ?? null);
  }, [poll]);
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}. ${year}`;
  };

  const handleOptionPress = async (optionId: string, answerId: string) => {
    if (disabled || poll.isFinished || !onVote) return;
    const previous = selectedOptionId;
    setSelectedOptionId(optionId);
    try {
      await Promise.resolve(onVote(poll.id, answerId));
    } catch {
      setSelectedOptionId(previous);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {poll.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed ? { opacity: 0.85 } : undefined,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                void handleOptionPress(option.id, option.answerId ?? option.id);
              }}
              disabled={disabled || poll.isFinished}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionContent}>
                  <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.text}</Text>
                </View>
                <Text style={[styles.percentage, isSelected && styles.percentageSelected]}>{option.percentage}%</Text>
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
            </Pressable>
          );
        })}
      </View>

      {poll.isFinished && poll.endedAt && (
        <Text style={styles.footerText}>Poll finished {formatDate(poll.endedAt)}</Text>
      )}
    </View>
  );
};

export default PollCard;
