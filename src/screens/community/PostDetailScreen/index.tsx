import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GradientBackground, KeyboardAwareScreen, ScreenWithHeader } from '@/components/ui/layout';
import { PostCard, PostReplies } from '@/components/sections/community';
import ReplyInput from '@/components/ui/inputs/ReplyInput';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { BOTTOM_DOCK_BAR_HEIGHT, COLORS, SPACING } from '@/constants';
import type { Post } from '@/types';
import { useKeyboardInset, usePostReplies, useTranslation } from '@/hooks';
import { communityService } from '@/services';
import { mapCommunityPostToPost } from '@/utils';
import { logger } from '@/utils/logger';

type Props = {
  navigation: any;
  route: {
    params: CommunityStackParamList['PostDetail'];
  };
};

const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { post } = route.params;
  const [messageText, setMessageText] = useState('');
  const { t } = useTranslation();
  const keyboardInset = useKeyboardInset();
  const [composerHeight, setComposerHeight] = useState(BOTTOM_DOCK_BAR_HEIGHT);

  const [likeBootstrap, setLikeBootstrap] = useState({
    initialLikes: post.likes ?? 0,
    isLiked: post.isLiked ?? false,
    myReactions: post.myReactions,
  });
  const [snapshotMedia, setSnapshotMedia] = useState<Pick<Post, 'image' | 'videoUrl' | 'attachments'> | null>(null);

  useEffect(() => {
    setLikeBootstrap({
      initialLikes: post.likes ?? 0,
      isLiked: post.isLiked ?? false,
      myReactions: post.myReactions,
    });
    setSnapshotMedia(null);
  }, [post.id]);

  useEffect(() => {
    if (post.poll) return;
    let cancelled = false;
    (async () => {
      try {
        const feed = await communityService.getCommunityPostSnapshot(post.id);
        const raw = feed.posts?.[0];
        if (cancelled || !raw) return;
        const mapped = mapCommunityPostToPost(
          raw,
          feed.files,
          feed.users,
          feed.comments,
          feed.postChildren,
          feed.posts,
        );
        if (cancelled || !mapped) return;
        setLikeBootstrap({
          initialLikes: mapped.likes ?? 0,
          isLiked: mapped.isLiked ?? false,
          myReactions: mapped.myReactions,
        });
        setSnapshotMedia({
          image: mapped.image,
          videoUrl: mapped.videoUrl,
          attachments: mapped.attachments,
        });
      } catch (error) {
        logger.warn('Sincronização do like no detalhe do post falhou:', { postId: post.id, cause: error });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [post.id, post.poll]);

  const { replyCardComments, addPostComment, isAddingPostComment, likeCount, isLiked, isLiking, togglePostLike } =
    usePostReplies({
      postId: post.id,
      enabled: !post.poll,
      initialLikes: likeBootstrap.initialLikes,
      isLiked: likeBootstrap.isLiked,
      myReactions: likeBootstrap.myReactions,
    });
  const scrollViewRef = useRef<ScrollView>(null);

  const postWithMedia = useMemo(
    () => ({
      ...post,
      image: snapshotMedia?.image ?? post.image,
      videoUrl: snapshotMedia?.videoUrl ?? post.videoUrl,
      attachments: snapshotMedia?.attachments ?? post.attachments,
    }),
    [post, snapshotMedia],
  );

  const postForRendering = useMemo(() => {
    return {
      ...postWithMedia,
      comments: [] as Post['comments'],
      commentsCount: replyCardComments.length,
    };
  }, [postWithMedia, replyCardComments.length]);

  const isSendDisabled = isAddingPostComment || messageText.trim().length === 0;

  const scrollPaddingBottom = composerHeight + keyboardInset + SPACING.MD;

  const handleSendComment = async () => {
    if (isSendDisabled) return;

    try {
      const ok = await addPostComment(messageText);
      if (ok) {
        setMessageText('');
      }
    } catch {
      // Mantém o texto caso falhe.
    }
  };

  useEffect(() => {
    if (!replyCardComments.length) return;
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [replyCardComments.length]);

  return (
    <View style={styles.screenRoot}>
      <ScreenWithHeader
        navigation={navigation}
        headerProps={{
          showBackButton: true,
          onBackPress: () => navigation?.goBack?.(),
        }}
        contentContainerStyle={styles.screenContent}
        contentBackgroundColor={COLORS.BACKGROUND_SECONDARY}
      >
        <View pointerEvents='none' style={styles.gradientBackground}>
          <GradientBackground />
        </View>

        <KeyboardAwareScreen
          scrollViewStyle={styles.scroll}
          scrollContentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
          scrollRef={scrollViewRef}
        >
          <PostCard
            post={postForRendering}
            postEngagement={{ likeCount, isLiked, isLiking, togglePostLike }}
            forceContentExpanded
            styles={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />

          {!post.poll && <PostReplies replyCardComments={replyCardComments} />}
        </KeyboardAwareScreen>
      </ScreenWithHeader>

      {!post.poll ? (
        <View pointerEvents='box-none' style={styles.composerOverlay}>
          <View
            pointerEvents='auto'
            style={[styles.composerDock, { bottom: keyboardInset }]}
            onLayout={(event) => setComposerHeight(event.nativeEvent.layout.height)}
          >
            <ReplyInput
              value={messageText}
              onChangeText={setMessageText}
              onSend={handleSendComment}
              sendDisabled={isSendDisabled}
              placeholder={t('chat.messagePlaceholder')}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default PostDetailScreen;
