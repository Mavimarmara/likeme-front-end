import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { CommentCard } from '@/components/ui';
import type { PostReplyCardComment } from '@/hooks/community/usePostReplies';
import { useTranslation } from '@/hooks';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = {
  replyCardComments: PostReplyCardComment[];
  isLoading?: boolean;
  commentsError?: string | null;
  onRetry?: () => void;
};

const PostReplies: React.FC<Props> = ({ replyCardComments, isLoading = false, commentsError = null, onRetry }) => {
  const { t } = useTranslation();

  if (isLoading && replyCardComments.length === 0) {
    return (
      <View style={styles.stateContainer} accessibilityLabel={t('community.loadingComments')}>
        <ActivityIndicator size='small' color={COLORS.PRIMARY.PURE} />
        <Text style={styles.stateLabel}>{t('community.loadingComments')}</Text>
      </View>
    );
  }

  if (commentsError && replyCardComments.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorLabel}>{t('community.commentsLoadError')}</Text>
        {onRetry ? (
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed ? { opacity: 0.85 } : undefined]}
            onPress={onRetry}
            accessibilityRole='button'
            accessibilityLabel={t('community.retryComments')}
          >
            <Text style={styles.retryButtonLabel}>{t('community.retryComments')}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.commentsSection}>
      {isLoading ? (
        <View style={styles.inlineLoadingRow}>
          <ActivityIndicator size='small' color={COLORS.PRIMARY.PURE} />
        </View>
      ) : null}
      {replyCardComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={{
            ...comment,
          }}
          showReplies
        />
      ))}
    </View>
  );
};

export default PostReplies;
