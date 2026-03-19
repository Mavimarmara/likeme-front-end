import React from 'react';
import { View } from 'react-native';
import { CommentCard } from '@/components/ui';
import type { PostReplyCardComment } from '@/hooks/community/usePostReplies';
import { styles } from './styles';

type Props = {
  replyCardComments: PostReplyCardComment[];
};
const PostReplies: React.FC<Props> = ({ replyCardComments }) => {
  return (
    <View style={styles.commentsSection}>
      {replyCardComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={{
            ...comment,
          }}
          showReplies={true}
        />
      ))}
    </View>
  );
};

export default PostReplies;
