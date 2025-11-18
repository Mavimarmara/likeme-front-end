import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { Comment } from '@/services/commentsService';

type Props = {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  onUpvote?: (commentId: string) => void;
  onDownvote?: (commentId: string) => void;
  showReplies?: boolean;
  onToggleReplies?: () => void;
  level?: number;
};

const CommentCard: React.FC<Props> = ({
  comment,
  onReply,
  onUpvote,
  onDownvote,
  showReplies = false,
  onToggleReplies,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isAvatarUri = comment.author.avatar && typeof comment.author.avatar === 'string';

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  };

  const handleToggleReplies = () => {
    setIsExpanded(!isExpanded);
    if (onToggleReplies) {
      onToggleReplies();
    }
  };

  return (
    <View style={[styles.container, level > 0 && styles.replyContainer]}>
      <View style={styles.commentHeader}>
        {comment.author.avatar ? (
          isAvatarUri ? (
            <Image
              source={{ uri: comment.author.avatar as string }}
              style={styles.avatar}
            />
          ) : (
            <Image source={comment.author.avatar as ImageSourcePropType} style={styles.avatar} />
          )
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={16} color="#666" />
          </View>
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{comment.author.name}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(comment.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.content}>{comment.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onUpvote && onUpvote(comment.id)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-upward" size={18} color="#000" />
          <Text style={styles.actionCount}>{comment.upvotes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDownvote && onDownvote(comment.id)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-downward" size={18} color="#000" />
        </TouchableOpacity>

        {onReply && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReply(comment)}
            activeOpacity={0.7}
          >
            <Icon name="chat-bubble-outline" size={18} color="#000" />
            {hasReplies && (
              <Text style={styles.replyCount}>{comment.replies?.length}</Text>
            )}
          </TouchableOpacity>
        )}

        {hasReplies && onToggleReplies && (
          <TouchableOpacity
            style={styles.hideButton}
            onPress={handleToggleReplies}
            activeOpacity={0.7}
          >
            <Icon name={isExpanded ? 'expand-less' : 'expand-more'} size={18} color="#000" />
            <Text style={styles.hideText}>{isExpanded ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasReplies && isExpanded && showReplies && (
        <View style={styles.repliesContainer}>
          {comment.replies?.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              showReplies={showReplies}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentCard;

