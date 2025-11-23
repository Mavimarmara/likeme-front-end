import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { COLORS } from '@/constants';

type Props = {
  upvotes: number;
  downvotes?: number;
  commentsCount?: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReply?: () => void;
  onToggle?: () => void;
};

const CommentReactions: React.FC<Props> = ({
  upvotes,
  downvotes = 0,
  commentsCount = 0,
  onUpvote,
  onDownvote,
  onReply,
  onToggle,
}) => {
  const displayUpvotes = upvotes > 0 ? upvotes : 0;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={onUpvote}
          activeOpacity={0.7}
        >
          <Icon
            name="keyboard-arrow-up"
            size={18}
            color="#001137"
          />
          {displayUpvotes > 0 && (
            <Text style={styles.reactionCount}>{displayUpvotes}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reactionButton}
          onPress={onDownvote}
          activeOpacity={0.7}
        >
          <Icon
            name="keyboard-arrow-down"
            size={18}
            color="#001137"
          />
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

