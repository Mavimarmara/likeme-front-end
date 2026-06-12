import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@/hooks/i18n';
import { isPollClosed } from '@/utils/community/pollClosure';
import { styles } from './styles';
import type { Poll, PollOption } from '@/types';

type Props = {
  poll: Poll;
  onVote?: (pollId: string, answerId: string) => void | Promise<void>;
  disabled?: boolean;
};

function isPollInteractionLocked(poll: Poll, disabled: boolean): boolean {
  return disabled || poll.isFinished || isPollClosed({ endedAt: poll.endedAt, isFinished: poll.isFinished });
}

const PollCard: React.FC<Props> = ({ poll, onVote, disabled = false }) => {
  const { t } = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const interactionLocked = isPollInteractionLocked(poll, disabled);

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
    if (interactionLocked || !onVote) return;

    const previous = selectedOptionId;
    setSelectedOptionId(optionId);
    try {
      await Promise.resolve(onVote(poll.id, answerId));
    } catch {
      setSelectedOptionId(previous);
    }
  };

  const renderOption = (option: PollOption) => {
    const isSelected = selectedOptionId === option.id;
    const optionBody = (
      <>
        <View style={styles.optionHeader}>
          <View style={styles.optionContent}>
            <View
              style={[
                styles.radioButton,
                isSelected && styles.radioButtonSelected,
                interactionLocked && styles.radioButtonDisabled,
              ]}
            >
              {isSelected ? <View style={styles.radioButtonInner} /> : null}
            </View>
            <Text
              style={[
                styles.optionText,
                isSelected && !interactionLocked && styles.optionTextSelected,
                interactionLocked && styles.optionTextDisabled,
              ]}
            >
              {option.text}
            </Text>
          </View>
          <Text
            style={[
              styles.percentage,
              isSelected && !interactionLocked && styles.percentageSelected,
              interactionLocked && styles.percentageDisabled,
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
              isSelected && !interactionLocked && styles.progressBarFillSelected,
              interactionLocked && styles.progressBarFillDisabled,
            ]}
          />
        </View>
      </>
    );

    if (interactionLocked) {
      return (
        <View key={option.id} style={[styles.option, styles.optionDisabled]}>
          {optionBody}
        </View>
      );
    }

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
      >
        {optionBody}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {interactionLocked ? <Text style={styles.closedDisclaimer}>{t('community.poll.closedDisclaimer')}</Text> : null}

      <View style={styles.optionsContainer}>{poll.options.map(renderOption)}</View>

      {interactionLocked && poll.endedAt ? (
        <Text style={styles.footerText}>{t('community.poll.closedOn', { date: formatDate(poll.endedAt) })}</Text>
      ) : null}
    </View>
  );
};

export default PollCard;
