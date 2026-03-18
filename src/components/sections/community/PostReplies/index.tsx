import React from 'react';
import { View } from 'react-native';
import { CommentCard } from '@/components/ui';
import type { Post } from '@/types';
import { styles } from './styles';
import { usePostReplies } from '@/hooks';

type Props = {
  postId: Post['id'];
  comments: Post['comments'];
};
const PostReplies: React.FC<Props> = ({ postId, comments }) => {
  const { replyCardComments } = usePostReplies({ postId, comments });
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
