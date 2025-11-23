import type { CommunityPost, CommunityFile, CommunityUser, CommunityComment } from '@/types/community';
import type { Post, Comment, Poll } from '@/types';
import { logger } from '@/utils/logger';

const mapCommunityCommentToComment = (
  communityComment: CommunityComment,
  users?: CommunityUser[],
  files?: CommunityFile[]
): Comment => {
  const content = communityComment.data?.text || 
    (typeof communityComment.data === 'string' ? communityComment.data : '') ||
    JSON.stringify(communityComment.data || {});
  
  const user = users?.find(u => u.userId === communityComment.userId);
  
  // Calcular upvotes e downvotes baseado no objeto de reactions
  // reactions é um objeto como { "like": 1, "dislike": 0 }
  const reactionsObj = communityComment.reactions || {};
  const upvotes = reactionsObj['like'] || reactionsObj['upvote'] || reactionsObj['👍'] || 0;
  const downvotes = reactionsObj['dislike'] || reactionsObj['downvote'] || reactionsObj['👎'] || 0;
  
  // Converter o objeto de reactions para array se necessário (para manter compatibilidade)
  const reactionsArray: Array<{ id: string; userId: string; type: string }> = [];
  if (Object.keys(reactionsObj).length > 0) {
    Object.entries(reactionsObj).forEach(([type, count]) => {
      const countNum = typeof count === 'number' ? count : 0;
      for (let i = 0; i < countNum; i++) {
        reactionsArray.push({
          id: `${communityComment.commentId}-${type}-${i}`,
          userId: '',
          type,
        });
      }
    });
  }
  const reactions: Comment['reactions'] = reactionsArray.length > 0 ? reactionsArray : undefined;
  
  return {
    id: communityComment.commentId,
    userId: communityComment.userId,
    content,
    createdAt: new Date(communityComment.createdAt),
    userName: user?.displayName,
    userAvatar: user?.avatarFileId ? 
      files?.find(f => f.fileId === user.avatarFileId)?.fileUrl : undefined,
    reactionsCount: communityComment.reactionsCount,
    reactions,
  };
};

const mapCommunityPostToPoll = (communityPost: CommunityPost): Poll | undefined => {
  if (communityPost.structureType !== 'poll' || !communityPost.data) {
    return undefined;
  }

  const question = communityPost.data.question || 
    communityPost.data.title || 
    communityPost.data.text || 
    '';
  
  if (!question) {
    return undefined;
  }

  const options = communityPost.data.options || [];
  const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || opt.voteCount || 0), 0);
  
  const pollOptions = options.map((opt, index) => {
    const votes = opt.votes || opt.voteCount || 0;
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    
    return {
      id: opt.id || `option-${index}`,
      text: opt.text || String(opt) || `Opção ${index + 1}`,
      votes,
      percentage,
    };
  });

  const endedAt = communityPost.data.endedAt || communityPost.data.endDate;
  const isFinished = !!endedAt;

  return {
    id: communityPost.postId || communityPost._id || '',
    question,
    options: pollOptions,
    totalVotes,
    endedAt: endedAt ? new Date(endedAt) : undefined,
    isFinished,
  };
};

export const mapCommunityPostToPost = (
  communityPost: CommunityPost,
  files?: CommunityFile[],
  users?: CommunityUser[],
  comments?: CommunityComment[]
): Post | null => {
  const postId = communityPost.postId || communityPost._id || '';
  const userId = communityPost.postedUserId || communityPost.userId || '';

  if (!postId) {
    logger.warn('Post sem ID válido:', communityPost);
    return null;
  }

  if (!communityPost.createdAt) {
    logger.warn('Post sem createdAt:', communityPost);
    return null;
  }

  let imageUrl: string | undefined;
  
  if (communityPost.data?.fileId && files) {
    const file = files.find(f => f.fileId === communityPost.data?.fileId);
    imageUrl = file?.fileUrl;
  }

  const user = users?.find(u => u.userId === userId);
  const userName = user?.displayName || undefined;
  const userAvatar = user?.avatarFileId ? 
    files?.find(f => f.fileId === user.avatarFileId)?.fileUrl : undefined;

  const likes = communityPost.reactionsCount || 0;
  
  // Mapear comentários relacionados a este post
  const postComments: Post['comments'] = (comments || [])
    .filter(comment => {
      const referenceId = comment.referenceId;
      return referenceId === postId || referenceId === communityPost._id;
    })
    .map(comment => mapCommunityCommentToComment(comment, users, files));

  let content = '';
  
  if (communityPost.data) {
    if (typeof communityPost.data === 'string') {
      content = communityPost.data;
    } else if (typeof communityPost.data === 'object') {
      content = 
        communityPost.data.text || 
        communityPost.data.title || 
        (Object.keys(communityPost.data).length > 0
          ? JSON.stringify(communityPost.data)
          : '');
    }
  }

  if (!content) {
    content = 'Post sem conteúdo';
  }

  // Mapear poll se structureType for "poll"
  const poll = mapCommunityPostToPoll(communityPost);

  // Extrair tags do post (pode estar em data.tags ou diretamente em tags)
  let tags: string | string[] | undefined;
  const rawTags = (communityPost as any).tags || communityPost.data?.tags;
  
  if (rawTags) {
    // Se for array, usar diretamente
    if (Array.isArray(rawTags)) {
      tags = rawTags.filter(tag => tag && typeof tag === 'string' && tag.toLowerCase() !== 'tags');
    } 
    // Se for string, verificar se não é a palavra "Tags"
    else if (typeof rawTags === 'string' && rawTags.toLowerCase() !== 'tags') {
      tags = rawTags;
    }
    // Se for objeto, tentar extrair valores
    else if (typeof rawTags === 'object') {
      const tagValues = Object.values(rawTags).filter(
        val => val && typeof val === 'string' && val.toLowerCase() !== 'tags'
      );
      if (tagValues.length > 0) {
        tags = tagValues.length === 1 ? (tagValues[0] as string) : (tagValues as string[]);
      }
    }
  }
  
  logger.debug('Tags mapping:', {
    postId,
    rawTags,
    mappedTags: tags,
    rawTagsType: typeof rawTags,
    isArray: Array.isArray(rawTags),
  });

  // Usar commentsCount do CommunityPost, ou o tamanho dos comentários mapeados como fallback
  const commentsCount = communityPost.commentsCount !== undefined 
    ? communityPost.commentsCount 
    : postComments.length;

  const post: Post = {
    id: postId,
    userId: userId,
    content,
    image: imageUrl,
    likes,
    comments: postComments,
    commentsCount,
    createdAt: new Date(communityPost.createdAt),
    category: (communityPost as any).category || (communityPost as any).dataType || undefined,
    tags,
    overline: (communityPost as any).overline || undefined,
    title: communityPost.data?.title || undefined,
    userName,
    userAvatar,
    poll,
  };

  logger.debug('Mapped post:', { 
    postId: post.id, 
    userId: post.userId, 
    contentLength: post.content.length,
    hasImage: !!post.image,
    likes: post.likes,
    commentsCount: post.comments.length,
    hasPoll: !!post.poll,
    structureType: communityPost.structureType,
    originalPost: {
      _id: communityPost._id,
      postId: communityPost.postId,
      postedUserId: communityPost.postedUserId,
      userId: communityPost.userId,
      structureType: communityPost.structureType,
      dataType: (communityPost as any).dataType,
      data: communityPost.data,
    }
  });

  return post;
};

