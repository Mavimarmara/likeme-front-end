import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground, KeyboardAwareScreen, ScreenWithHeader } from '@/components/ui/layout';
import { PostCard, PostReplies } from '@/components/sections/community';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { COLORS, KEYBOARD_AWARE_SCROLL } from '@/constants';
import type { Post } from '@/types';
import { useFloatingMenu } from '@/contexts/FloatingMenuContext';
import { IconButton } from '@/components/ui/buttons';
import { useMenuItems, usePostReplies, useTranslation } from '@/hooks';
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

  const [likeBootstrap, setLikeBootstrap] = useState({
    initialLikes: post.likes ?? 0,
    isLiked: post.isLiked ?? false,
    myReactions: post.myReactions,
  });

  useEffect(() => {
    setLikeBootstrap({
      initialLikes: post.likes ?? 0,
      isLiked: post.isLiked ?? false,
      myReactions: post.myReactions,
    });
  }, [post.id]);

  useEffect(() => {
    if (post.poll) return;
    let cancelled = false;
    (async () => {
      try {
        const feed = await communityService.getCommunityPostSnapshot(post.id);
        const raw = feed.posts?.[0];
        if (cancelled || !raw) return;
        const mapped = mapCommunityPostToPost(raw, feed.files, feed.users, feed.comments, feed.postChildren);
        if (cancelled || !mapped) return;
        setLikeBootstrap({
          initialLikes: mapped.likes ?? 0,
          isLiked: mapped.isLiked ?? false,
          myReactions: mapped.myReactions,
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
  const { bottom: bottomInset } = useSafeAreaInsets();

  const menuItems = useMenuItems(navigation);
  const { clearMenu, setMenu } = useFloatingMenu();

  useEffect(() => {
    // Esconde o menu enquanto o usuário está em PostDetail.
    // Ao voltar, restauramos o menu para não ficar "apagado" no estado global.
    clearMenu();

    return () => {
      setMenu(menuItems, 'community');
    };
  }, [clearMenu, menuItems, setMenu]);

  const postForRendering = useMemo(() => {
    return {
      ...post,
      comments: [] as Post['comments'],
      commentsCount: replyCardComments.length,
    };
  }, [post, replyCardComments.length]);

  const isSendDisabled = isAddingPostComment || messageText.trim().length === 0;

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
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        showBackButton: true,
        onBackPress: () => navigation?.goBack?.(),
      }}
      contentContainerStyle={{ flex: 1 }}
      contentBackgroundColor={COLORS.BACKGROUND_SECONDARY}
    >
      <View pointerEvents='none' style={styles.gradientBackground}>
        <GradientBackground />
      </View>

      <KeyboardAwareScreen
        scrollViewStyle={styles.scroll}
        scrollContentContainerStyle={{ paddingBottom: KEYBOARD_AWARE_SCROLL.CONTENT_FALLBACK_PADDING_BOTTOM }}
        includeBottomSafeAreaOnFooter={false}
        scrollRef={scrollViewRef}
        footer={
          !post.poll ? (
            <View style={[styles.inputContainer, bottomInset > 0 ? { paddingBottom: bottomInset } : null]}>
              <View style={[styles.textInputWrapper]}>
                <TextInput
                  style={styles.textInput}
                  placeholder={t('chat.messagePlaceholder')}
                  placeholderTextColor='rgba(110,106,106,0.6)'
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                />
              </View>

              <IconButton
                icon='send'
                variant='dark'
                onPress={handleSendComment}
                backgroundSize='medium'
                disabled={isSendDisabled}
              />
            </View>
          ) : null
        }
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
  );
};

export default PostDetailScreen;
