import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge } from '@/components/ui';
import { CachedImage } from '@/components/ui/media/CachedImage';
import PollCard from '../PollCard';
import { usePost, usePostReplies, type PostLikeEngagement } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { styles as cardStyles } from './styles';
import { COLORS, COMMUNITY_POST_PREVIEW_MAX_LINES } from '@/constants';
import type { Post } from '@/types';
import {
  capitalizeWords,
  getContentPreviewFromPost,
  getPostContentTypeLabel,
  getPostTypeBadgeColor,
  getTitleFromPost,
} from '@/utils/community/postCardUtils';
import { logger } from '@/utils/logger';
import { PostEmbeddedVideo } from './PostEmbeddedVideo';

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

  const imageUri = post.image?.trim() ? post.image.trim() : undefined;
  const videoUri = post.videoUrl?.trim() ? post.videoUrl.trim() : undefined;
  const showMediaBlock = Boolean((imageUri || videoUri) && !activePoll);
  const [videoPlaybackOpen, setVideoPlaybackOpen] = useState(false);
  const [descriptionWidth, setDescriptionWidth] = useState<number | null>(null);
  const [textExceedsMaxLines, setTextExceedsMaxLines] = useState<boolean | null>(null);
  const previousDescriptionWidthRef = useRef<number | null>(null);

  useEffect(() => {
    setVideoPlaybackOpen(false);
  }, [post.id, videoUri]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setVideoPlaybackOpen(false);
      };
    }, []),
  );

  useEffect(() => {
    setTextExceedsMaxLines(null);
    previousDescriptionWidthRef.current = null;
    setDescriptionWidth(null);
  }, [post.id, postPreviewContent]);

  useEffect(() => {
    if (descriptionWidth == null || descriptionWidth <= 0) {
      return;
    }
    const prev = previousDescriptionWidthRef.current;
    if (prev !== null && prev !== descriptionWidth) {
      setTextExceedsMaxLines(null);
    }
    previousDescriptionWidthRef.current = descriptionWidth;
  }, [descriptionWidth]);

  const handleDescriptionContainerLayout = (event: LayoutChangeEvent) => {
    const w = Math.round(event.nativeEvent.layout.width);
    if (w <= 0) return;
    setDescriptionWidth((prev) => (prev === w ? prev : w));
  };

  const handlePreviewMeasureLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const lineCount = event.nativeEvent.lines.length;
    setTextExceedsMaxLines(lineCount > COMMUNITY_POST_PREVIEW_MAX_LINES);
  };

  const collapsedPreviewNumberOfLines =
    isContentExpanded || forceContentExpanded
      ? undefined
      : textExceedsMaxLines === false
      ? undefined
      : COMMUNITY_POST_PREVIEW_MAX_LINES;

  const shouldMeasurePreviewLines =
    Boolean(postPreviewContent) &&
    !forceContentExpanded &&
    !isContentExpanded &&
    descriptionWidth != null &&
    descriptionWidth > 0 &&
    textExceedsMaxLines === null;

  const showPreviewExpandControl = Boolean(postPreviewContent) && !forceContentExpanded && textExceedsMaxLines === true;

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

  const onPostImageError = () => {
    logger.warn('Falha ao carregar imagem do post', { postId: post.id, uri: imageUri });
  };

  const cardInner = (
    <>
      <View style={cardStyles.contentContainer}>
        <View style={cardStyles.badgeContainer}>
          <Badge label={contentTypeLabel} color={typeBadgeColor} />
        </View>

        <View>
          <View style={cardStyles.authorSection}>
            {post.userAvatar ? (
              <CachedImage
                source={{ uri: post.userAvatar }}
                style={cardStyles.avatar}
                recyclingKey={`post-${post.id}-avatar`}
              />
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
            <View
              style={{ position: 'relative' }}
              onLayout={handleDescriptionContainerLayout}
              testID='post-card-description-wrap'
            >
              <Text
                testID='post-card-description'
                style={cardStyles.description}
                {...(collapsedPreviewNumberOfLines != null ? { numberOfLines: collapsedPreviewNumberOfLines } : {})}
                ellipsizeMode='tail'
              >
                {postPreviewContent}
              </Text>
              {shouldMeasurePreviewLines ? (
                <Text
                  testID='post-card-description-measure'
                  style={[
                    cardStyles.description,
                    {
                      position: 'absolute',
                      opacity: 0,
                      width: descriptionWidth ?? undefined,
                      left: 0,
                      top: 0,
                      zIndex: -1,
                    },
                  ]}
                  pointerEvents='none'
                  accessible={false}
                  importantForAccessibility='no-hide-descendants'
                  onTextLayout={handlePreviewMeasureLayout}
                >
                  {postPreviewContent}
                </Text>
              ) : null}
            </View>
          ) : null}

          {showMediaBlock ? (
            <View style={cardStyles.mediaContainer}>
              {videoUri ? (
                videoPlaybackOpen ? (
                  <PostEmbeddedVideo
                    videoUri={videoUri}
                    onCollapse={() => setVideoPlaybackOpen(false)}
                    containerStyle={forceContentExpanded ? cardStyles.mediaImageExpanded : cardStyles.mediaImage}
                  />
                ) : (
                  <Pressable
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      setVideoPlaybackOpen(true);
                    }}
                    accessibilityRole='button'
                    accessibilityLabel='Reproduzir vídeo'
                  >
                    <View style={cardStyles.videoPosterInner}>
                      {imageUri ? (
                        <CachedImage
                          testID='post-card-video-poster'
                          accessibilityLabel='Imagem do post'
                          source={{ uri: imageUri }}
                          style={forceContentExpanded ? cardStyles.mediaImageExpanded : cardStyles.mediaImage}
                          recyclingKey={`post-${post.id}-media`}
                          onError={onPostImageError}
                        />
                      ) : (
                        <View
                          style={[
                            forceContentExpanded ? cardStyles.mediaImageExpanded : cardStyles.mediaImage,
                            cardStyles.videoPlaceholder,
                          ]}
                        />
                      )}
                      <View style={cardStyles.playOverlay} pointerEvents='none'>
                        <Icon
                          name='play-circle-outline'
                          size={forceContentExpanded ? 56 : 44}
                          color='rgba(255,255,255,0.95)'
                        />
                      </View>
                    </View>
                  </Pressable>
                )
              ) : imageUri ? (
                <CachedImage
                  testID='post-card-image-only'
                  accessibilityLabel='Imagem do post'
                  source={{ uri: imageUri }}
                  style={forceContentExpanded ? cardStyles.mediaImageExpanded : cardStyles.mediaImage}
                  recyclingKey={`post-${post.id}-media`}
                  onError={onPostImageError}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {activePoll && <PollCard poll={activePoll} onVote={submitPollVote} disabled={false} />}

      <View style={cardStyles.footer}>
        <View style={cardStyles.footerLeft}>
          {!activePoll && showPreviewExpandControl && (
            <Pressable
              testID='post-card-see-more'
              style={({ pressed }) => [cardStyles.seeMoreButton, pressed ? { opacity: 0.85 } : undefined]}
              onPress={(e) => {
                e?.stopPropagation?.();
                handleSeeMorePress();
              }}
              accessibilityRole='button'
              accessibilityLabel={isContentExpanded ? t('common.seeLess') : t('avatar.seeMore')}
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
                e?.stopPropagation?.();
                togglePostLike();
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
                e?.stopPropagation?.();
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
    </>
  );

  const videoExpandedBlocksPostNavigation = Boolean(videoUri && videoPlaybackOpen);

  if (onPress != null) {
    if (videoExpandedBlocksPostNavigation) {
      return <View style={[cardStyles.container, containerStyles]}>{cardInner}</View>;
    }
    return (
      <Pressable
        style={({ pressed }) => [cardStyles.container, containerStyles, pressed ? { opacity: 0.92 } : undefined]}
        onPress={handlePostPress}
        accessibilityRole='button'
        accessibilityLabel='Ver detalhes do post'
      >
        {cardInner}
      </Pressable>
    );
  }

  return <View style={[cardStyles.container, containerStyles]}>{cardInner}</View>;
};

const PostCardWithRepliesLikes: React.FC<Omit<Props, 'postEngagement'>> = (props) => {
  const { likeCount, isLiked, isLiking, togglePostLike } = usePostReplies({
    postId: props.post.id,
    enabled: false, // só queremos o estado do like, sem buscar comentários
    initialLikes: props.post.likes ?? 0,
    isLiked: props.post.isLiked ?? false,
    myReactions: props.post.myReactions,
  });

  return <PostCardView {...props} engagement={{ likeCount, isLiked, isLiking, togglePostLike }} />;
};

const PostCard: React.FC<Props> = (props) => {
  if (props.postEngagement) {
    return <PostCardView {...props} engagement={props.postEngagement} />;
  }
  return <PostCardWithRepliesLikes {...props} />;
};

export default PostCard;
