import React, { useState } from 'react';
import { Image, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge } from '@/components/ui';
import { PollCard } from '@/components/sections/community';
import { useTranslation } from '@/hooks/i18n';
import { styles as cardStyles } from './styles';
import { COLORS } from '@/constants';
import type { Post } from '@/types';
import communityService from '@/services/community/communityService';
import { logger } from '@/utils/logger';

type Props = {
  post: Post;
  onPress?: (post: Post) => void;
  category?: string;
  initialContentExpanded?: boolean;
  initialCommentsOpen?: boolean;
  onCommentsOpenChange?: (open: boolean) => void;
  /**
   * Permite sobrescrever o estilo do container principal do card.
   * Usado pela `PostDetailScreen` para ajustar cantos/arredondamento.
   */
  styles?: StyleProp<ViewStyle>;
  /**
   * Quando true, força o conteúdo sempre expandido e oculta o botão see more/see less.
   * Usado na `PostDetailScreen`.
   */
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
  const [isCommentsOpen, setIsCommentsOpen] = useState(initialCommentsOpen);
  const [isContentExpanded, setIsContentExpanded] = useState(forceContentExpanded ? true : initialContentExpanded);
  const [likeDelta, setLikeDelta] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getTitle = (): string => {
    if (post.title) return post.title;

    const lines = post.content.split('\n').filter((line) => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 30 && firstLine.length < 150) {
        return firstLine;
      }
    }

    const sentences = post.content.split(/[.!?]/).filter((s) => s.trim());
    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim();
      if (firstSentence.length > 30 && firstSentence.length < 150) {
        return firstSentence;
      }
    }

    const truncated = post.content.substring(0, 120).trim();
    if (truncated.length >= 30) {
      return truncated;
    }

    return post.content.substring(0, 100);
  };

  const getContent = (): string => {
    if (!post.content) return '';

    const title = getTitle();
    let remaining = post.content;

    if (post.title && post.content.startsWith(post.title)) {
      remaining = post.content.substring(post.title.length).trim();
    } else if (post.content.startsWith(title)) {
      remaining = post.content.substring(title.length).trim();
    }

    if (remaining.length > 0) {
      return remaining;
    }

    return '';
  };

  // Usar tags para o badge - se não houver tags, não mostrar badge
  // Filtrar a string "Tags" se vier como valor literal
  const getFirstTag = (): string | null => {
    if (!post.tags) return null;

    if (Array.isArray(post.tags)) {
      const validTag = post.tags.find((tag) => tag && typeof tag === 'string' && tag.toLowerCase() !== 'tags');
      return validTag || null;
    }

    if (typeof post.tags === 'string' && post.tags.toLowerCase() !== 'tags') {
      return post.tags;
    }

    return null;
  };

  const badgeLabel = getFirstTag();
  const title = getTitle();
  const content = getContent();
  // Usar commentsCount do post se disponível, senão usar o tamanho do array de comentários
  const commentsCount = post.commentsCount !== undefined ? post.commentsCount : post.comments?.length || 0;

  const handleCommentsPress = () => {
    const next = !isCommentsOpen;
    setIsCommentsOpen(next);
    onCommentsOpenChange?.(next);
    onPress?.(post);
  };

  const handleSeeMorePress = () => {
    if (forceContentExpanded) return;
    setIsContentExpanded(!isContentExpanded);
  };

  const handlePollVote = async (pollId: string, optionId: string) => {
    try {
      // Usar o pollId real da enquete (data.pollId), não o postId
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
      // TODO: Atualizar o estado do post para refletir o novo voto
      // Isso pode requerer recarregar o feed ou atualizar o post localmente
    } catch (error) {
      logger.error('Erro ao votar na enquete:', error);
      // TODO: Mostrar mensagem de erro para o usuário
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
    <View style={[cardStyles.container, containerStyles]}>
      <TouchableOpacity
        onPress={onPress != null ? handlePostPress : undefined}
        activeOpacity={0.85}
        disabled={onPress == null}
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

            {title ? (
              <View style={cardStyles.titleContainer}>
                <Text style={cardStyles.title}>{title}</Text>
              </View>
            ) : null}

            {content ? (
              <Text style={cardStyles.description} numberOfLines={isContentExpanded ? undefined : 3}>
                {content}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      {post.poll && <PollCard poll={post.poll} onVote={handlePollVote} disabled={false} />}

      <View style={cardStyles.footer}>
        <View style={cardStyles.footerLeft}>
          {!post.poll && content && !forceContentExpanded && (
            <TouchableOpacity style={cardStyles.seeMoreButton} onPress={handleSeeMorePress} activeOpacity={0.7}>
              <Text style={cardStyles.seeMoreButtonText}>
                {isContentExpanded ? t('common.seeLess') : t('avatar.seeMore')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={cardStyles.footerRight}>
          {!post.poll && (
            <TouchableOpacity
              style={[cardStyles.likeButton, isLiking && cardStyles.likeButtonDisabled]}
              onPress={handleLikePress}
              activeOpacity={0.7}
              disabled={isLiking || isLiked}
              accessibilityRole='button'
              accessibilityLabel='Like'
            >
              <Icon name={isLiked ? 'thumb-up' : 'thumb-up-off-alt'} size={18} color='#0154f8' />
              <Text style={cardStyles.likeCount}>{likeCount}</Text>
            </TouchableOpacity>
          )}

          {/* Não mostrar botão de comentários quando for uma enquete */}
          {!post.poll && (
            <TouchableOpacity style={cardStyles.commentsInfo} onPress={handleCommentsPress} activeOpacity={0.7}>
              <Icon name='chat-bubble-outline' size={18} color='#0154f8' />
              <Text style={cardStyles.commentsCount}>{commentsCount}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;
