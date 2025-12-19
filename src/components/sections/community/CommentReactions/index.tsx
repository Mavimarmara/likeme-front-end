import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { COLORS } from '@/constants';

type Props = {
  upvotes: number;
  downvotes?: number;
  commentsCount?: number;
  selectedReaction?: 'like' | 'dislike' | null;
  disabled?: boolean;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReply?: () => void;
  onToggle?: () => void;
};

const CommentReactions: React.FC<Props> = ({
  upvotes,
  downvotes = 0,
  commentsCount = 0,
  selectedReaction = null,
  disabled = false,
  onUpvote,
  onDownvote,
  onReply,
  onToggle,
}) => {
  const displayUpvotes = upvotes > 0 ? upvotes : 0;
  const displayDownvotes = downvotes > 0 ? downvotes : 0;
  const isLikeSelected = selectedReaction === 'like';
  const isDislikeSelected = selectedReaction === 'dislike';
  const isDisabled = disabled;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={[
            styles.reactionButton,
            isLikeSelected && styles.reactionButtonSelected,
            isDisabled && styles.reactionButtonDisabled,
          ]}
          onPress={onUpvote}
          activeOpacity={0.7}
          disabled={isDisabled}
        >
          <Icon
            name="keyboard-arrow-up"
            size={18}
            color={isLikeSelected ? COLORS.WHITE : '#001137'}
          />
          {displayUpvotes > 0 && (
            <Text
              style={[
                styles.reactionCount,
                isLikeSelected && styles.reactionCountSelected,
              ]}
            >
              {displayUpvotes}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.reactionButton,
            isDislikeSelected && styles.reactionButtonSelected,
            isDisabled && styles.reactionButtonDisabled,
          ]}
          onPress={onDownvote}
          activeOpacity={0.7}
          disabled={isDisabled}
        >
          <Icon
            name="keyboard-arrow-down"
            size={18}
            color={isDislikeSelected ? COLORS.WHITE : '#001137'}
          />
          {displayDownvotes > 0 && (
            <Text
              style={[
                styles.reactionCount,
                isDislikeSelected && styles.reactionCountSelected,
              ]}
            >
              {displayDownvotes}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        {commentsCount > 0 && (
            <TouchableOpacity
            style={styles.commentButton}
            onPress={onReply}
            activeOpacity={0.7}
            >
                <Icon
                    name="chat-bubble-outline"
                    size={24}
                    color="#001137"
                />
                <Text style={styles.commentCount}>{commentsCount}</Text>
            </TouchableOpacity>
        )}

        {onToggle && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onToggle}
            activeOpacity={0.7}
          >
            <Icon
              name="keyboard-arrow-up"
              size={24}
              color="#0154f8"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommentReactions;

