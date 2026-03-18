import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import { PostCard, PostReplies } from '@/components/sections/community';
import { IconButton } from '@/components/ui/buttons';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants';
import type { Comment, Post } from '@/types';
import { useTranslation } from '@/hooks/i18n';
import { useFloatingMenu } from '@/contexts/FloatingMenuContext';

type Props = {
  navigation: any;
  route: {
    params: CommunityStackParamList['PostDetail'];
  };
};

const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { post } = route.params;
  const [comments, setComments] = useState<Post['comments']>(post.comments);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { t } = useTranslation();
  const { clearMenu } = useFloatingMenu();

  useEffect(() => {
    clearMenu();
  }, [clearMenu]);

  const postForRendering = useMemo(() => {
    return {
      ...post,
      comments,
      commentsCount: comments.length,
    };
  }, [post, comments]);

  const isSendDisabled = sending || messageText.trim().length === 0;

  const handleSendComment = useCallback(async () => {
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
  }, [isSendDisabled, messageText, sending, post.id]);

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
          contentContainerStyle={{ padding: SPACING.MD, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <PostCard post={postForRendering} forceContentExpanded />

          {!post.poll && <PostReplies postId={post.id} comments={postForRendering.comments} />}
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
