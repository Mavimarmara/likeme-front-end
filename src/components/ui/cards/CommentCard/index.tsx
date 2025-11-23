import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommentReactions } from '@/components/ui/community';
import { styles } from './styles';

type Comment = {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  upvotes?: number;
  downvotes?: number;
  reactionsCount?: number;
  commentsCount?: number;
  createdAt: string;
  replies?: Comment[];
  replyToId?: string;
};

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

  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
        <Text style={styles.authorName}>{capitalizeWords(comment.author.name)}</Text>
      </View>

      <Text style={styles.content}>{comment.content}</Text>

      <CommentReactions
        upvotes={comment.upvotes || 0}
        downvotes={comment.downvotes || 0}
        commentsCount={comment.commentsCount}
        onUpvote={() => onUpvote?.(comment.id)}
        onDownvote={() => onDownvote?.(comment.id)}
        onReply={() => onReply?.(comment)}
        onToggle={hasReplies ? handleToggleReplies : undefined}
      />

      {hasReplies && (
        <TouchableOpacity
          style={styles.hideButton}
          onPress={handleToggleReplies}
          activeOpacity={0.7}
        >
          <Text style={styles.hideText}>{isExpanded ? 'hide' : 'show'}</Text>
        </TouchableOpacity>
      )}

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

