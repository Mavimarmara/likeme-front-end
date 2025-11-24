import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import type { Poll } from '@/types';

type Props = {
  poll: Poll;
};

const PollCard: React.FC<Props> = ({ poll }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {poll.options.map((option) => (
          <View key={option.id} style={styles.option}>
            <View style={styles.optionHeader}>
              <View style={styles.optionContent}>
                <View style={styles.radioButton} />
                <Text style={styles.optionText}>{option.text}</Text>
                </View>
                <Text style={styles.percentage}>{option.percentage}%</Text>
              </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground} />
              <View style={[styles.progressBarFill, { width: `${option.percentage}%` }]} />
            </View>
          </View>
        ))}
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
