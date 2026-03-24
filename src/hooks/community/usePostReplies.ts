import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Post } from '@/types';
import { communityService } from '@/services';
import { logger } from '@/utils/logger';

export type PostLikeEngagement = {
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  togglePostLike: () => Promise<void>;
};

export function usePostLikeEngagement({
  postId,
  initialLikes = 0,
}: {
  postId: Post['id'];
  initialLikes?: number;
}): PostLikeEngagement {
  const [likeDelta, setLikeDelta] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setLikeDelta(0);
    setIsLiked(false);
  }, [postId]);

  const likeCount = initialLikes + likeDelta;

  const togglePostLike = useCallback(async () => {
    if (!postId || isLiking) return;

    setIsLiking(true);
    try {
      const ok = isLiked
        ? await communityService.removePostReaction(String(postId), 'like')
        : await communityService.addPostReaction(String(postId), 'like');

      if (ok) {
        setLikeDelta((d) => (isLiked ? Math.max(d - 1, 0) : d + 1));
        setIsLiked((prev) => !prev);
      }
    } catch (error) {
      logger.error('Erro ao aplicar reação no post:', error);
    } finally {
      setIsLiking(false);
    }
  }, [postId, isLiked, isLiking]);

  return { likeCount, isLiked, isLiking, togglePostLike };
}

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
  replies?: PostReplyCardComment[];
  userReaction?: 'like' | 'dislike';
};

type UsePostRepliesOptions = {
  postId: Post['id'];
  enabled?: boolean;
  initialLikes?: number;
};

export const usePostReplies = ({ postId, enabled = true, initialLikes = 0 }: UsePostRepliesOptions) => {
  const { likeCount, isLiked, isLiking, togglePostLike } = usePostLikeEngagement({
    postId,
    initialLikes,
  });
  const [remoteReplyCardComments, setRemoteReplyCardComments] = useState<PostReplyCardComment[] | null>(null);
  const [localOptimisticComments, setLocalOptimisticComments] = useState<PostReplyCardComment[]>([]);
  const [fetchNonce, setFetchNonce] = useState(0);
  const [isAddingPostComment, setIsAddingPostComment] = useState(false);

  const refresh = useCallback(() => {
    setFetchNonce((v) => v + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (!postId) return;

    const run = async () => {
      try {
        const raw = await communityService.getCommentsByReference(String(postId), 'post');
        const data = raw?.data ?? raw;

        const rootComments = Array.isArray(data?.comments) ? data.comments : [];
        const childComments = Array.isArray(data?.commentChildren) ? data.commentChildren : [];
        // `communityUsers` é relação de membership e não necessariamente contém `displayName`/`avatar`.
        // Para renderizar nome e foto, preferimos `users`.
        const commentUsers = (() => {
          if (Array.isArray(data?.users)) return data.users;
          if (Array.isArray(data?.communityUsers)) return data.communityUsers;
          return [];
        })();
        const commentFiles = Array.isArray(data?.files) ? data.files : [];

        const getUser = (commentNode: any) => {
          const commentUserId = commentNode?.userId;
          const commentUserPublicId = commentNode?.userPublicId;
          const commentUserInternalId = commentNode?.userInternalId;

          return commentUsers.find((u: any) => {
            if (commentUserId && u?.userId === commentUserId) return true;
            if (commentUserPublicId && u?.userPublicId === commentUserPublicId) return true;
            if (commentUserInternalId && u?.userInternalId === commentUserInternalId) return true;
            return false;
          });
        };

        const getAvatarUrl = (user: any) => {
          const avatarFileId = user?.avatarFileId;
          if (!avatarFileId) return undefined;
          return commentFiles.find((f: any) => f?.fileId === avatarFileId)?.fileUrl;
        };

        const computeUpvotes = (reactions: Record<string, number> | undefined): number => {
          if (!reactions) return 0;
          return (reactions.like ?? 0) + (reactions.upvote ?? 0) + (reactions['👍'] ?? 0);
        };

        const computeDownvotes = (reactions: Record<string, number> | undefined): number => {
          if (!reactions) return 0;
          return (reactions.dislike ?? 0) + (reactions.downvote ?? 0) + (reactions['👎'] ?? 0);
        };

        const computeUserReaction = (myReactions: string[] | undefined): 'like' | 'dislike' | undefined => {
          if (!myReactions || myReactions.length === 0) return undefined;
          if (myReactions.includes('like')) return 'like';
          if (myReactions.includes('dislike')) return 'dislike';
          return undefined;
        };

        const buildNode = (remoteComment: any, postIdValue: string): PostReplyCardComment => {
          const commentId = remoteComment?.commentId ?? remoteComment?._id;
          const userId = remoteComment?.userId ?? remoteComment?.userPublicId ?? remoteComment?.userInternalId ?? '';
          const user = getUser(remoteComment);
          const avatar = getAvatarUrl(user);

          const createdAtIso = remoteComment?.createdAt
            ? new Date(remoteComment.createdAt).toISOString()
            : new Date().toISOString();

          const content =
            remoteComment?.data?.text ?? (typeof remoteComment?.data === 'string' ? remoteComment.data : '') ?? '';

          const reactions = remoteComment?.reactions as Record<string, number> | undefined;
          const upvotes = computeUpvotes(reactions);
          const downvotes = computeDownvotes(reactions);

          const myReactions = remoteComment?.myReactions as string[] | undefined;

          return {
            id: String(commentId),
            postId: postIdValue,
            author: {
              id: userId,
              name: user?.displayName ?? (userId ? `User ${String(userId).slice(0, 8)}` : 'Usuário'),
              avatar,
            },
            content,
            upvotes,
            downvotes,
            reactionsCount: remoteComment?.reactionsCount,
            commentsCount: undefined,
            createdAt: createdAtIso,
            replies: [],
            userReaction: computeUserReaction(myReactions),
          };
        };

        // Observacao: o tipo PostReplyCardComment nao tem `userReaction`,
        // mas o CommentCard aceita por tipagem estrutural (campo extra).
        const rootNodes: PostReplyCardComment[] = rootComments.map((c: any) => buildNode(c, String(postId)));
        const childrenNodes: PostReplyCardComment[] = childComments.map((c: any) => {
          const node = buildNode(c, String(postId));
          return node;
        });

        const nodesById = new Map<string, PostReplyCardComment>();
        [...rootNodes, ...childrenNodes].forEach((n) => nodesById.set(String(n.id), n));

        const orphans: PostReplyCardComment[] = [];
        childrenNodes.forEach((child: any, idx: number) => {
          const original = childComments[idx];
          const parentId = original?.parentId;
          const parent = nodesById.get(String(parentId));
          if (!parentId || !parent) {
            orphans.push(child);
            return;
          }
          if (!parent.replies) parent.replies = [];
          parent.replies.push(child);
        });

        const merged = [...rootNodes, ...orphans].reduce<PostReplyCardComment[]>((acc, item) => {
          const exists = acc.some((x) => x.id === item.id);
          if (!exists) acc.push(item);
          return acc;
        }, []);

        setRemoteReplyCardComments(merged);
      } catch (error) {
        // Mantemos fallback do feed quando falhar.
        logger.warn('Erro ao sincronizar replies do post:', error);
      }
    };

    run();
  }, [enabled, postId, fetchNonce]);

  const addPostComment = useCallback(
    async (text: string, parentId?: string) => {
      if (!postId) return false;
      if (isAddingPostComment) return false;

      const trimmedText = text?.trim();
      if (!trimmedText) return false;

      setIsAddingPostComment(true);

      const optimisticId = `temp-${Date.now()}`;
      const nowIso = new Date().toISOString();

      const optimisticComment: PostReplyCardComment = {
        id: optimisticId,
        postId: String(postId),
        author: {
          id: 'me',
          name: 'Você',
          avatar: undefined,
        },
        content: trimmedText,
        upvotes: 0,
        downvotes: 0,
        reactionsCount: 0,
        commentsCount: undefined,
        createdAt: nowIso,
        replies: [],
        userReaction: undefined,
      };

      setLocalOptimisticComments((prev) => [...prev, optimisticComment]);

      try {
        await communityService.addPostComment(String(postId), trimmedText, parentId);

        // Após confirmar no backend, removemos o optimistic e refazemos a lista.
        setLocalOptimisticComments((prev) => prev.filter((c) => c.id !== optimisticId));
        refresh();
        return true;
      } catch (error) {
        logger.warn('Erro ao adicionar comentário do post (optimistic removido):', error);
        setLocalOptimisticComments((prev) => prev.filter((c) => c.id !== optimisticId));
        return false;
      } finally {
        setIsAddingPostComment(false);
      }
    },
    [isAddingPostComment, postId, refresh],
  );

  const mergedForRender = useMemo(() => {
    const baseNodes = remoteReplyCardComments ?? [];

    if (!localOptimisticComments.length) return baseNodes;

    return [...baseNodes, ...localOptimisticComments].reduce<PostReplyCardComment[]>((acc, item) => {
      const exists = acc.some((x) => x.id === item.id);
      if (!exists) acc.push(item);
      return acc;
    }, []);
  }, [remoteReplyCardComments, localOptimisticComments]);

  return {
    likeCount,
    isLiked,
    isLiking,
    togglePostLike,
    replyCardComments: mergedForRender,
    addPostComment,
    isAddingPostComment,
  };
};
