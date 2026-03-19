import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import communityService from '@/services/community/communityService';
import { logger } from '@/utils/logger';

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
  userReaction?: 'like' | 'dislike';
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
  onDownvote: _onDownvote,
  showReplies = false,
  onToggleReplies,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isAvatarUri = comment.author.avatar && typeof comment.author.avatar === 'string';
  const [currentReaction, setCurrentReaction] = useState<'like' | 'dislike' | null>(comment.userReaction || null);
  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [, setDownvotes] = useState(comment.downvotes || 0);
  const [reactionLoading, setReactionLoading] = useState(false);

  useEffect(() => {
    setCurrentReaction(comment.userReaction || null);
    setUpvotes(comment.upvotes || 0);
    setDownvotes(comment.downvotes || 0);
  }, [comment]);

  const handleUpvotePress = async () => {
    if (reactionLoading) return;

    setReactionLoading(true);
    const previousReaction = currentReaction;
    setCurrentReaction(previousReaction === 'like' ? null : 'like');

    if (previousReaction === 'like') {
      setUpvotes((prev) => Math.max(prev - 1, 0));
    } else {
      setUpvotes((prev) => prev + 1);
      if (previousReaction === 'dislike') {
        setDownvotes((prev) => Math.max(prev - 1, 0));
      }
    }

    onUpvote?.(comment.id);

    try {
      if (previousReaction === 'like') {
        await communityService.removeCommentReaction(comment.id, 'like');
      } else {
        if (previousReaction === 'dislike') {
          await communityService.removeCommentReaction(comment.id, 'dislike');
        }
        await communityService.addCommentReaction(comment.id, 'like');
      }
    } catch (error) {
      logger.warn('Erro ao aplicar like (ignorado):', error);
    } finally {
      setReactionLoading(false);
    }
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatRelativeTime = (iso: string): string => {
    const created = new Date(iso);
    const diffMs = Date.now() - created.getTime();
    if (Number.isNaN(diffMs) || diffMs < 0) return '';

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    if (totalMinutes < 60) return `${Math.max(totalMinutes, 1)} min`;

    const totalHours = Math.floor(totalMinutes / 60);
    if (totalHours < 24) return `${Math.max(totalHours, 1)}h`;

    return '';
  };

  const CONTENT_COLLAPSED_LIMIT = 120;
  const shouldTruncate = comment.content.length > CONTENT_COLLAPSED_LIMIT;
  const collapsedContent = comment.content.substring(0, CONTENT_COLLAPSED_LIMIT).trim();
  const displayedContent = isContentExpanded || !shouldTruncate ? comment.content : collapsedContent;

  return (
    <View style={[styles.container, level > 0 && styles.replyContainer]}>
      <View style={styles.bodyRow}>
        {/* Coluna 1: imagem/avatar */}
        <View style={styles.imageColumn}>
          {comment.author.avatar ? (
            isAvatarUri ? (
              <Image source={{ uri: comment.author.avatar as string }} style={styles.avatar} />
            ) : (
              <Image source={comment.author.avatar as ImageSourcePropType} style={styles.avatar} />
            )
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name='person' size={16} color='#666' />
            </View>
          )}
        </View>

        {/* Coluna 2: conteúdo */}
        <View style={styles.contentColumn}>
          <Text style={styles.authorName}>{capitalizeWords(comment.author.name)}</Text>

          <Text style={styles.content}>
            {displayedContent}
            {shouldTruncate && (
              <>
                {!isContentExpanded && '... '}
                <Text style={styles.verMore} onPress={() => setIsContentExpanded((v) => !v)}>
                  Ver mais
                </Text>
              </>
            )}
          </Text>

          <Text style={styles.timeText}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>

        {/* Coluna 3: replies */}
        <View style={styles.metaColumn}>
          <TouchableOpacity
            style={styles.likeBubble}
            onPress={handleUpvotePress}
            activeOpacity={0.7}
            disabled={reactionLoading}
            accessibilityRole='button'
            accessibilityLabel='Curtir'
          >
            <Icon name={currentReaction === 'like' ? 'thumb-up' : 'thumb-up-off-alt'} size={18} color='#0154f8' />
            <Text style={styles.likeCount}>{upvotes}</Text>
          </TouchableOpacity>

          {hasReplies && (
            <TouchableOpacity style={styles.hideButton} onPress={handleToggleReplies} activeOpacity={0.7}>
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
                  onDownvote={_onDownvote}
                  showReplies={showReplies}
                  level={level + 1}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentCard;
