import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import { PostCard, PostReplies } from '@/components/sections/community';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import type { Post } from '@/types';
import { useFloatingMenu } from '@/contexts/FloatingMenuContext';
import { IconButton } from '@/components/ui/buttons';
import { useMenuItems, usePostReplies, useTranslation } from '@/hooks';

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

  const { replyCardComments, addPostComment, isAddingPostComment } = usePostReplies({
    postId: post.id,
    enabled: !post.poll,
  });
  const scrollViewRef = useRef<ScrollView>(null);

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <PostCard
            post={postForRendering}
            forceContentExpanded
            styles={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />

          {!post.poll && <PostReplies replyCardComments={replyCardComments} />}
        </ScrollView>

        {!post.poll && (
          <View style={styles.inputContainer}>
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
        )}
      </KeyboardAvoidingView>
    </ScreenWithHeader>
  );
};

export default PostDetailScreen;
