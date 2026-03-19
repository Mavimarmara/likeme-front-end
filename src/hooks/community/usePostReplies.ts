import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Post } from '@/types';
import { communityService } from '@/services';
import { logger } from '@/utils/logger';

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
  comments: Post['comments'];
  /**
   * Quando true, tenta puxar os comentários reais do backend (Amity).
   * Mantemos o `comments` como fallback para renderizar instantaneamente.
   */
  enabled?: boolean;
};

export const usePostReplies = ({ postId, comments, enabled = true }: UsePostRepliesOptions) => {
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
        const raw = await communityService.getAmityComments(String(postId), 'post');
        const data = raw?.data ?? raw;

        const amityComments = Array.isArray(data?.comments) ? data.comments : [];
        const amityChildren = Array.isArray(data?.commentChildren) ? data.commentChildren : [];
        const amityUsers = (() => {
          if (Array.isArray(data?.communityUsers)) return data.communityUsers;
          if (Array.isArray(data?.users)) return data.users;
          return [];
        })();
        const amityFiles = Array.isArray(data?.files) ? data.files : [];

        const getUser = (userId: string) => amityUsers.find((u: any) => u?.userId === userId);
        const getAvatarUrl = (user: any) => {
          const avatarFileId = user?.avatarFileId;
          if (!avatarFileId) return undefined;
          return amityFiles.find((f: any) => f?.fileId === avatarFileId)?.fileUrl;
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

        const buildNode = (amityComment: any, postIdValue: string): PostReplyCardComment => {
          const commentId = amityComment?.commentId ?? amityComment?._id;
          const userId = amityComment?.userId ?? '';
          const user = getUser(userId);
          const avatar = getAvatarUrl(user);

          const createdAtIso = amityComment?.createdAt
            ? new Date(amityComment.createdAt).toISOString()
            : new Date().toISOString();

          const content =
            amityComment?.data?.text ?? (typeof amityComment?.data === 'string' ? amityComment.data : '') ?? '';

          const reactions = amityComment?.reactions as Record<string, number> | undefined;
          const upvotes = computeUpvotes(reactions);
          const downvotes = computeDownvotes(reactions);

          const myReactions = amityComment?.myReactions as string[] | undefined;

          return {
            id: String(commentId),
            postId: postIdValue,
            author: {
              id: userId,
              name: user?.displayName ?? `User ${String(userId).slice(0, 8)}`,
              avatar,
            },
            content,
            upvotes,
            downvotes,
            reactionsCount: amityComment?.reactionsCount,
            commentsCount: undefined,
            createdAt: createdAtIso,
            replies: [],
            userReaction: computeUserReaction(myReactions),
          };
        };

        // Observacao: o tipo PostReplyCardComment nao tem `userReaction`,
        // mas o CommentCard aceita por tipagem estrutural (campo extra).
        const rootNodes: PostReplyCardComment[] = amityComments.map((c: any) => buildNode(c, String(postId)));
        const childrenNodes: PostReplyCardComment[] = amityChildren.map((c: any) => {
          const node = buildNode(c, String(postId));
          return node;
        });

        const nodesById = new Map<string, PostReplyCardComment>();
        [...rootNodes, ...childrenNodes].forEach((n) => nodesById.set(String(n.id), n));

        childrenNodes.forEach((child: any, idx: number) => {
          // parentId vem da schema do Amity
          const original = amityChildren[idx];
          const parentId = original?.parentId;
          if (!parentId) return;
          const parent = nodesById.get(String(parentId));
          if (!parent) return;
          if (!parent.replies) parent.replies = [];
          parent.replies.push(child);
        });

        const optimisticById = new Map<string, PostReplyCardComment>(
          replyFromProps(postId, comments).map((c) => [c.id, c]),
        );

        const merged = [...rootNodes, ...Array.from(optimisticById.values())].reduce<PostReplyCardComment[]>(
          (acc, item) => {
            const exists = acc.some((x) => x.id === item.id);
            if (!exists) acc.push(item);
            return acc;
          },
          [],
        );

        setRemoteReplyCardComments(merged);
      } catch (error) {
        // Mantemos fallback do feed quando falhar.
        logger.warn('Erro ao sincronizar replies do post:', error);
      }
    };

    run();
  }, [enabled, postId, comments, fetchNonce]);

  const replyFromProps = (postIdValue: Post['id'], initialComments: Post['comments']) => {
    return initialComments.map((comment) => {
      const countUpvotes = (reactions: Post['comments'][number]['reactions'] | undefined): number => {
        if (!reactions) return 0;
        return reactions.filter((r) => r.type === 'like' || r.type === 'upvote' || r.type === '👍').length || 0;
      };

      const countDownvotes = (reactions: Post['comments'][number]['reactions'] | undefined): number => {
        if (!reactions) return 0;
        return reactions.filter((r) => r.type === 'dislike' || r.type === 'downvote' || r.type === '👎').length || 0;
      };

      const safeCreatedAt =
        comment.createdAt instanceof Date ? comment.createdAt.toISOString() : new Date(comment.createdAt).toISOString();

      const authorName = comment.userName || `User ${comment.userId.slice(0, 8)}`;

      return {
        id: comment.id,
        postId: postIdValue,
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
  };

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
    const base = remoteReplyCardComments ?? replyCardComments;
    if (!localOptimisticComments.length) return base;

    return [...base, ...localOptimisticComments].reduce<PostReplyCardComment[]>((acc, item) => {
      const exists = acc.some((x) => x.id === item.id);
      if (!exists) acc.push(item);
      return acc;
    }, []);
  }, [replyCardComments, remoteReplyCardComments, localOptimisticComments]);

  return {
    replyCardComments: mergedForRender,
    addPostComment,
    isAddingPostComment,
  };
};
