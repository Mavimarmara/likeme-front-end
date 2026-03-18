import { useMemo } from 'react';
import type { Post } from '@/types';

export type PostReplyCardComment = {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  upvotes?: number;
  downvotes?: number;
  reactionsCount?: number;
  commentsCount?: number;
  createdAt: string;
};

type UsePostRepliesOptions = {
  postId: Post['id'];
  comments: Post['comments'];
};

export const usePostReplies = ({ postId, comments }: UsePostRepliesOptions) => {
  const replyCardComments = useMemo(() => {
    const countUpvotes = (reactions: Post['comments'][number]['reactions'] | undefined): number => {
      if (!reactions) return 0;
      return reactions.filter((r) => r.type === 'like' || r.type === 'upvote' || r.type === '👍').length || 0;
    };

    const countDownvotes = (reactions: Post['comments'][number]['reactions'] | undefined): number => {
      if (!reactions) return 0;
      return reactions.filter((r) => r.type === 'dislike' || r.type === 'downvote' || r.type === '👎').length || 0;
    };

    return comments.map((comment) => {
      const safeCreatedAt =
        comment.createdAt instanceof Date ? comment.createdAt.toISOString() : new Date(comment.createdAt).toISOString();

      const authorName = comment.userName || `User ${comment.userId.slice(0, 8)}`;

      return {
        id: comment.id,
        postId,
        author: {
          id: comment.userId,
          name: authorName,
          avatar: comment.userAvatar,
        },
        content: comment.content,
        upvotes: countUpvotes(comment.reactions),
        downvotes: countDownvotes(comment.reactions),
        reactionsCount: comment.reactionsCount,
        commentsCount: comment.commentsCount,
        createdAt: safeCreatedAt,
      } satisfies PostReplyCardComment;
    });
  }, [comments, postId]);

  return { replyCardComments };
};
