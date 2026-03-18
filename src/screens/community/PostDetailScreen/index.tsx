import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import { PostCard, PostReplies } from '@/components/sections/community';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import type { Post } from '@/types';
import { useFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useMenuItems } from '@/hooks';

type Props = {
  navigation: any;
  route: {
    params: CommunityStackParamList['PostDetail'];
  };
};

const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { post } = route.params;
  // Composer de comentários desativado por enquanto.
  // Quando reativar, você provavelmente vai querer reintroduzir `setComments`, `messageText`, `sending`, `t` e `handleSendComment`.
  // const [comments, setComments] = useState<Post['comments']>(post.comments);
  const [comments] = useState<Post['comments']>(post.comments);
  // const [messageText, setMessageText] = useState('');
  // const [sending, setSending] = useState(false);
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
      comments,
      commentsCount: comments.length,
    };
  }, [post, comments]);

  //const isSendDisabled = sending || messageText.trim().length === 0;

  /*const handleSendComment = useCallback(async () => {
    if (isSendDisabled) return;

    const trimmed = messageText.trim();
    if (trimmed.length === 0 || sending) return;

    setSending(true);
    try {
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        userId: 'me',
        content: trimmed,
        createdAt: new Date(),
        userName: 'Você',
        userAvatar: undefined,
      };

      setComments((prev) => [...prev, optimisticComment]);
      setMessageText('');
    } finally {
      setSending(false);
    }
  }, [isSendDisabled, messageText, sending, post.id]);*/

  useEffect(() => {
    if (!comments.length) return;
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [comments.length]);

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

          {!post.poll && <PostReplies postId={post.id} comments={postForRendering.comments} />}
        </ScrollView>

        {/*!post.poll && (
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
        )*/}
      </KeyboardAvoidingView>
    </ScreenWithHeader>
  );
};

export default PostDetailScreen;
