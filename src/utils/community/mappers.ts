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
  
  const reactionsObj = communityComment.reactions || {};
  const upvotes = reactionsObj['like'] || reactionsObj['upvote'] || reactionsObj['👍'] || 0;
  const downvotes = reactionsObj['dislike'] || reactionsObj['downvote'] || reactionsObj['👎'] || 0;
  
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

const mapCommunityPostToPoll = (
  communityPost: CommunityPost,
  postChildren?: CommunityPost[]
): Poll | undefined => {
  if (communityPost.structureType !== 'poll') {
    return undefined;
  }

  logger.debug('Processing poll post:', {
    postId: communityPost.postId || communityPost._id,
    structureType: communityPost.structureType,
    hasPollOptions: !!communityPost.pollOptions,
    pollOptionsCount: communityPost.pollOptions?.length || 0,
    question: communityPost.data?.text,
  });

  if (!communityPost.pollOptions || communityPost.pollOptions.length === 0) {
    logger.debug('Poll post sem pollOptions:', {
      postId: communityPost.postId || communityPost._id,
      structureType: communityPost.structureType,
    });
    return undefined;
  }

  const question = communityPost.data?.text || '';
  
  if (!question) {
    logger.warn('Poll post sem question (data.text):', {
      postId: communityPost.postId || communityPost._id,
      data: communityPost.data,
    });
    return undefined;
  }

  // Ordenar opções por sequenceNumber (igual ao backend faz)
  const sortedPollOptions = [...communityPost.pollOptions].sort((a, b) => {
    const seqA = a.sequenceNumber ?? 0;
    const seqB = b.sequenceNumber ?? 0;
    return seqA - seqB;
  });

  const pollOptions = sortedPollOptions.map((option, index) => {
    const text = option.data?.text || '';
    
    if (!text) {
      logger.warn('Poll option sem text (data.text):', {
        optionId: option.postId || option._id,
        index,
        sequenceNumber: option.sequenceNumber,
        data: option.data,
      });
    }
    
    const votes = option.reactionsCount || 0;
    
    return {
      id: option.postId || option._id || `option-${index}`,
      text: text || `Opção ${index + 1}`,
      votes: Number(votes),
      percentage: 0,
    };
  });

  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.votes, 0);
  const pollOptionsWithPercentage = pollOptions.map(opt => ({
    ...opt,
    percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
  }));

  const endedAt = communityPost.data?.endedAt || communityPost.data?.endDate;
  const pollId = communityPost.data?.pollId;
  
  return {
    id: communityPost.postId || communityPost._id || '',
    pollId: pollId || undefined, // ID real da enquete (data.pollId)
    question,
    options: pollOptionsWithPercentage,
    totalVotes,
    endedAt: endedAt ? new Date(endedAt) : undefined,
    isFinished: !!endedAt,
  };
};

export const mapCommunityPostToPost = (
  communityPost: CommunityPost,
  files?: CommunityFile[],
  users?: CommunityUser[],
  comments?: CommunityComment[],
  postChildren?: CommunityPost[]
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
  
  const postComments: Post['comments'] = (comments || [])
    .filter(comment => {
      const referenceId = comment.referenceId;
      return referenceId === postId || referenceId === communityPost._id;
    })
    .map(comment => mapCommunityCommentToComment(comment, users, files));

  let content = '';
  let title: string | undefined;
  
  if (communityPost.data) {
    if (typeof communityPost.data === 'string') {
      content = communityPost.data;
    } else if (typeof communityPost.data === 'object') {
      content = communityPost.data.text || '';
      title = communityPost.data.title;
      
      if (!content && title) {
        logger.warn('Post sem data.text, usando title como fallback:', {
          postId,
          data: communityPost.data,
        });
        content = title;
        title = undefined;
      }
    }
  }

  if (!content) {
    logger.warn('Post sem conteúdo (data.text vazio):', {
      postId,
      structureType: communityPost.structureType,
      data: communityPost.data,
    });
    content = 'Post sem conteúdo';
  }

  const poll = mapCommunityPostToPoll(communityPost, postChildren);

  let tags: string | string[] | undefined;
  const rawTags = (communityPost as any).tags || communityPost.data?.tags;
  
  if (rawTags) {
    if (Array.isArray(rawTags)) {
      tags = rawTags.filter(tag => tag && typeof tag === 'string' && tag.toLowerCase() !== 'tags');
    } 
    else if (typeof rawTags === 'string' && rawTags.toLowerCase() !== 'tags') {
      tags = rawTags;
    }
    else if (typeof rawTags === 'object') {
      const tagValues = Object.values(rawTags).filter(
        val => val && typeof val === 'string' && val.toLowerCase() !== 'tags'
      );
      if (tagValues.length > 0) {
        tags = tagValues.length === 1 ? (tagValues[0] as string) : (tagValues as string[]);
      }
    }
  }

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
    title,
    userName,
    userAvatar,
    poll,
  };
  
  return post;
};

