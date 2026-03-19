import React, { useState } from 'react';
import { Image, Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge } from '@/components/ui';
import { PollCard } from '@/components/sections/community';
import { useTranslation } from '@/hooks/i18n';
import { styles as cardStyles } from './styles';
import { COLORS } from '@/constants';
import type { Post } from '@/types';
import communityService from '@/services/community/communityService';
import { logger } from '@/utils/logger';
import {
  capitalizeWords,
  getContentPreviewFromPost,
  getFirstTagLabelFromPost,
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
};

const PostCard: React.FC<Props> = ({
  post,
  onPress,
  category: _category,
  initialContentExpanded = false,
  initialCommentsOpen = false,
  onCommentsOpenChange,
  styles: containerStyles,
  forceContentExpanded = false,
}) => {
  const { t } = useTranslation();
  const [, setIsCommentsOpen] = useState(initialCommentsOpen);
  const [isContentExpanded, setIsContentExpanded] = useState(forceContentExpanded ? true : initialContentExpanded);
  const [likeDelta, setLikeDelta] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const badgeLabel = getFirstTagLabelFromPost(post);
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

  const handlePollVote = async (pollId: string, optionId: string) => {
    try {
      const realPollId = post.poll?.pollId;

      if (!realPollId) {
        logger.error('Poll ID não encontrado na enquete', {
          postId: post.id,
          pollId: post.poll?.id,
          pollData: post.poll,
        });
        return;
      }

      logger.debug('Votando na enquete:', {
        pollId: realPollId,
        optionId,
        postId: post.id,
      });

      await communityService.votePoll(realPollId, [optionId]);
      logger.info('Voto registrado com sucesso:', { pollId: realPollId, optionId });
    } catch (error) {
      logger.error('Erro ao votar na enquete:', error);
    }
  };

  const likeCount = (post.likes ?? 0) + likeDelta;

  const handleLikePress = async () => {
    if (isLiking || isLiked) return;

    setIsLiking(true);
    try {
      const ok = await communityService.addPostReaction(post.id, 'like');
      if (ok) {
        setLikeDelta((d) => d + 1);
        setIsLiked(true);
      }
    } catch (error) {
      logger.error('Erro ao dar like no post:', error);
    } finally {
      setIsLiking(false);
    }
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
      disabled={onPress == null}
      accessibilityRole='button'
      accessibilityLabel='Ver detalhes do post'
    >
      <View style={cardStyles.contentContainer}>
        {badgeLabel && (
          <View style={cardStyles.badgeContainer}>
            <Badge label={badgeLabel} />
          </View>
        )}

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

      {post.poll && <PollCard poll={post.poll} onVote={handlePollVote} disabled={false} />}

      <View style={cardStyles.footer}>
        <View style={cardStyles.footerLeft}>
          {!post.poll && postPreviewContent && !forceContentExpanded && (
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
          {!post.poll && (
            <Pressable
              style={({ pressed }) => [
                cardStyles.likeButton,
                isLiking && cardStyles.likeButtonDisabled,
                pressed && !isLiking && !isLiked ? { opacity: 0.85 } : undefined,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                void handleLikePress();
              }}
              disabled={isLiking || isLiked}
              accessibilityRole='button'
              accessibilityLabel='Like'
            >
              <Icon name={isLiked ? 'thumb-up' : 'thumb-up-off-alt'} size={18} color='#0154f8' />
              <Text style={cardStyles.likeCount}>{likeCount}</Text>
            </Pressable>
          )}

          {!post.poll && (
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

export default PostCard;
