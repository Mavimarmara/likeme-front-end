import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import type { Post, PostAttachment } from '@/types';
import { logger } from '@/utils/logger';
import PostAttachmentFileCard from './PostAttachmentFileCard';
import PostImageFullscreenModal from './PostImageFullscreenModal';
import { PostEmbeddedVideo } from '../PostCard/PostEmbeddedVideo';
import { attachmentStyles as styles } from './styles';

type Props = {
  post: Pick<Post, 'id' | 'image' | 'videoUrl' | 'attachments'>;
  expanded?: boolean;
  onVideoPlaybackChange?: (open: boolean) => void;
};

const FILE_KINDS = new Set<PostAttachment['kind']>(['pdf', 'spreadsheet', 'document', 'generic']);

function legacyAttachmentsFromPost(post: Props['post']): PostAttachment[] {
  const out: PostAttachment[] = [];
  const imageUri = post.image?.trim();
  const videoUri = post.videoUrl?.trim();

  if (imageUri) {
    out.push({
      id: `${post.id}-legacy-image`,
      url: imageUri,
      kind: 'image',
      fileName: 'Imagem',
      extension: '',
    });
  }

  if (videoUri) {
    out.push({
      id: `${post.id}-legacy-video`,
      url: videoUri,
      kind: 'video',
      fileName: 'Vídeo',
      extension: '',
      posterUrl: imageUri,
    });
  }

  return out;
}

const PostAttachmentsSection: React.FC<Props> = ({ post, expanded = false, onVideoPlaybackChange }) => {
  const attachments = useMemo(
    () => (post.attachments?.length ? post.attachments : legacyAttachmentsFromPost(post)),
    [post],
  );

  const images = attachments.filter((item) => item.kind === 'image');
  const videos = attachments.filter((item) => item.kind === 'video');
  const files = attachments.filter((item) => FILE_KINDS.has(item.kind));

  const [fullscreenUri, setFullscreenUri] = useState<string | null>(null);
  const [videoPlaybackOpen, setVideoPlaybackOpen] = useState(false);
  const primaryVideo = videos[0];

  useEffect(() => {
    setVideoPlaybackOpen(false);
    setFullscreenUri(null);
  }, [post.id, primaryVideo?.url]);

  useEffect(() => {
    onVideoPlaybackChange?.(videoPlaybackOpen);
  }, [onVideoPlaybackChange, videoPlaybackOpen]);

  if (attachments.length === 0) {
    return null;
  }

  const mediaImageStyle = expanded ? styles.mediaImageExpanded : styles.mediaImage;
  const containerStyle: StyleProp<ViewStyle> = [styles.mediaContainer, mediaImageStyle];

  const onPostImageError = (uri: string) => {
    logger.warn('Falha ao carregar imagem do post', { postId: post.id, uri });
  };

  const renderImageGrid = () => {
    if (images.length === 0) return null;

    if (images.length === 1) {
      const image = images[0];
      return (
        <Pressable
          onPress={(event) => {
            event?.stopPropagation?.();
            setFullscreenUri(image.url);
          }}
          accessibilityRole='button'
          accessibilityLabel='Abrir imagem em tela cheia'
        >
          <CachedImage
            testID='post-card-image-only'
            accessibilityLabel='Imagem do post'
            source={{ uri: image.url }}
            style={mediaImageStyle}
            recyclingKey={`post-${post.id}-media-0`}
            onError={() => onPostImageError(image.url)}
          />
        </Pressable>
      );
    }

    const maxVisible = images.length > 4 ? 3 : 4;
    const visible = images.slice(0, maxVisible);
    const hiddenCount = images.length - visible.length;

    return (
      <View style={styles.imageGrid}>
        {visible.map((image, index) => {
          const isLastWithMore = hiddenCount > 0 && index === visible.length - 1;
          return (
            <Pressable
              key={image.id}
              style={[styles.imageGridCell, styles.imageGridHalf]}
              onPress={(event) => {
                event?.stopPropagation?.();
                setFullscreenUri(image.url);
              }}
              accessibilityRole='button'
              accessibilityLabel='Abrir imagem em tela cheia'
            >
              <CachedImage
                source={{ uri: image.url }}
                style={{ width: '100%', height: '100%' }}
                recyclingKey={`post-${post.id}-grid-${index}`}
                onError={() => onPostImageError(image.url)}
              />
              {isLastWithMore ? (
                <View style={styles.imageGridOverlay} pointerEvents='none'>
                  <Text style={styles.imageGridOverlayText}>+{hiddenCount + 1}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderVideo = () => {
    if (!primaryVideo) return null;

    if (videoPlaybackOpen) {
      return (
        <PostEmbeddedVideo
          videoUri={primaryVideo.url}
          onCollapse={() => setVideoPlaybackOpen(false)}
          containerStyle={containerStyle}
        />
      );
    }

    const posterUri = primaryVideo.posterUrl ?? images[0]?.url;

    return (
      <Pressable
        onPress={(event) => {
          event?.stopPropagation?.();
          setVideoPlaybackOpen(true);
        }}
        accessibilityRole='button'
        accessibilityLabel='Reproduzir vídeo'
      >
        <View style={styles.videoPosterInner}>
          {posterUri ? (
            <CachedImage
              testID='post-card-video-poster'
              accessibilityLabel='Imagem do post'
              source={{ uri: posterUri }}
              style={mediaImageStyle}
              recyclingKey={`post-${post.id}-video-poster`}
              onError={() => onPostImageError(posterUri)}
            />
          ) : (
            <View style={[mediaImageStyle, styles.videoPlaceholder]} />
          )}
          <View style={styles.playOverlay} pointerEvents='none'>
            <Icon name='play-circle-outline' size={expanded ? 56 : 44} color='rgba(255,255,255,0.95)' />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.container} testID='post-attachments-section'>
        {primaryVideo ? <View style={styles.mediaContainer}>{renderVideo()}</View> : null}

        {images.length > 0 ? (
          <View style={images.length === 1 ? styles.mediaContainer : undefined}>{renderImageGrid()}</View>
        ) : null}

        {files.map((file) => (
          <PostAttachmentFileCard key={file.id} attachment={file} />
        ))}
      </View>

      <PostImageFullscreenModal
        uri={fullscreenUri ?? ''}
        visible={Boolean(fullscreenUri)}
        onClose={() => setFullscreenUri(null)}
      />
    </>
  );
};

export default PostAttachmentsSection;
