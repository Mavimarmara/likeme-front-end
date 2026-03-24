import React, { useState } from 'react';
import { Image, Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge } from '@/components/ui';
import { PollCard } from '@/components/sections/community';
import { usePost, usePostLikeEngagement, type PostLikeEngagement } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { styles as cardStyles } from './styles';
import { COLORS } from '@/constants';
import type { Post } from '@/types';
import {
  capitalizeWords,
  getContentPreviewFromPost,
  getPostContentTypeLabel,
  getPostTypeBadgeColor,
  getTitleFromPost,
} from '@/utils/community/postCardUtils';

type Props = {
  post: Post;
  onPress?: (post: Post) => void;
  category?: string;
  initialContentExpanded?: boolean;
  initialCommentsOpen?: boolean;
  onCommentsOpenChange?: (open: boolean) => void;
  styles?: StyleProp<ViewStyle>;
  forceContentExpanded?: boolean;
  /** Quando definido (ex.: tela de detalhe com `usePostReplies`), evita segunda instância de likes. */
  postEngagement?: PostLikeEngagement;
};

type ViewProps = Props & { engagement: PostLikeEngagement };

const PostCardView: React.FC<ViewProps> = ({
  post,
  onPress,
  category: _category,
  initialContentExpanded = false,
  initialCommentsOpen = false,
  onCommentsOpenChange,
  styles: containerStyles,
  forceContentExpanded = false,
  engagement,
}) => {
  const { t } = useTranslation();
  const [, setIsCommentsOpen] = useState(initialCommentsOpen);
  const [isContentExpanded, setIsContentExpanded] = useState(forceContentExpanded ? true : initialContentExpanded);
  const { activePoll, submitPollVote } = usePost(post);

  const { likeCount, isLiked, isLiking, togglePostLike } = engagement;

  const contentTypeLabel = getPostContentTypeLabel(post, t);
  const typeBadgeColor = getPostTypeBadgeColor(post);
  const postTitle = getTitleFromPost(post);
  const postPreviewContent = getContentPreviewFromPost(post);
  const commentsCount = post.commentsCount !== undefined ? post.commentsCount : post.comments?.length || 0;

  const handleCommentsPress = () => {
    setIsCommentsOpen((prev) => {
      const next = !prev;
      onCommentsOpenChange?.(next);
      return next;
    });
    onPress?.(post);
  };

  const handleSeeMorePress = () => {
    if (forceContentExpanded) return;
    setIsContentExpanded((prev) => !prev);
  };

  const handlePostPress = () => {
    onPress?.(post);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        cardStyles.container,
        containerStyles,
        pressed && onPress != null ? { opacity: 0.92 } : undefined,
      ]}
      onPress={onPress != null ? handlePostPress : undefined}
      accessibilityRole={onPress != null ? 'button' : undefined}
      accessibilityLabel={onPress != null ? 'Ver detalhes do post' : undefined}
    >
      <View style={cardStyles.contentContainer}>
        <View style={cardStyles.badgeContainer}>
          <Badge label={contentTypeLabel} color={typeBadgeColor} />
        </View>

        <View>
          <View style={cardStyles.authorSection}>
            {post.userAvatar ? (
              <Image source={{ uri: post.userAvatar }} style={cardStyles.avatar} />
            ) : (
              <View style={cardStyles.avatarPlaceholder}>
                <Icon name='person' size={12} color={COLORS.TEXT_LIGHT} />
              </View>
            )}
            {post.userName && <Text style={cardStyles.authorName}>{capitalizeWords(post.userName)}</Text>}
          </View>

          {postTitle ? (
            <View style={cardStyles.titleContainer}>
              <Text style={cardStyles.title}>{postTitle}</Text>
            </View>
          ) : null}

          {postPreviewContent ? (
            <Text style={cardStyles.description} numberOfLines={isContentExpanded ? undefined : 3}>
              {postPreviewContent}
            </Text>
          ) : null}
        </View>
      </View>

      {activePoll && <PollCard poll={activePoll} onVote={submitPollVote} disabled={false} />}

      <View style={cardStyles.footer}>
        <View style={cardStyles.footerLeft}>
          {!activePoll && postPreviewContent && !forceContentExpanded && (
            <Pressable
              style={({ pressed }) => [cardStyles.seeMoreButton, pressed ? { opacity: 0.85 } : undefined]}
              onPress={(e) => {
                e.stopPropagation();
                handleSeeMorePress();
              }}
              accessibilityRole='button'
              accessibilityLabel='Expandir conteúdo'
            >
              <Text style={cardStyles.seeMoreButtonText}>
                {isContentExpanded ? t('common.seeLess') : t('avatar.seeMore')}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={cardStyles.footerRight}>
          {!activePoll && (
            <Pressable
              style={({ pressed }) => [
                cardStyles.likeButton,
                isLiking && cardStyles.likeButtonDisabled,
                pressed && !isLiking ? { opacity: 0.85 } : undefined,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                void togglePostLike();
              }}
              disabled={isLiking}
              accessibilityRole='button'
              accessibilityLabel='Like'
            >
              <Icon name={isLiked ? 'thumb-up' : 'thumb-up-off-alt'} size={18} color='#0154f8' />
              <Text style={cardStyles.likeCount}>{likeCount}</Text>
            </Pressable>
          )}

          {!activePoll && (
            <Pressable
              style={({ pressed }) => [cardStyles.commentsInfo, pressed ? { opacity: 0.85 } : undefined]}
              onPress={(e) => {
                e.stopPropagation();
                handleCommentsPress();
              }}
              accessibilityRole='button'
              accessibilityLabel='Abrir comentários'
            >
              <Icon name='chat-bubble-outline' size={18} color='#0154f8' />
              <Text style={cardStyles.commentsCount}>{commentsCount}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const PostCardWithInternalEngagement: React.FC<Omit<Props, 'postEngagement'>> = (props) => {
  const engagement = usePostLikeEngagement({
    postId: props.post.id,
    initialLikes: props.post.likes ?? 0,
  });
  return <PostCardView {...props} engagement={engagement} />;
};

const PostCard: React.FC<Props> = (props) => {
  if (props.postEngagement) {
    return <PostCardView {...props} engagement={props.postEngagement} />;
  }
  return <PostCardWithInternalEngagement {...props} />;
};

export default PostCard;
