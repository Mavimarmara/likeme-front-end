import type { CommunityPost, CommunityFile, CommunityUser, CommunityComment, PollDetail } from '@/types/community';
import type { Post, Comment, Poll } from '@/types';
import { logger } from '@/utils/logger';
import { communityService } from '@/services';

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

const mapCommunityPostToPoll = async (
  communityPost: CommunityPost
): Promise<Poll | undefined> => {
  if (communityPost.structureType !== 'poll') {
    return undefined;
  }

  // Extrair pollId de diferentes lugares
  const pollId = communityPost.data?.poll?.pollId || 
                 communityPost.data?.pollId || 
                 (communityPost.data?.poll as any)?.pollId ||
                 undefined;

  // PRIORIDADE 1: Se temos pollId mas não temos dados completos, buscar do endpoint
  if (pollId && !communityPost.data?.poll?.options) {
    try {
      logger.debug('Fetching poll details from API:', { pollId });
      const pollResponse = await communityService.getPollDetail(pollId);
      
      const pollDetail = pollResponse.data?.poll || pollResponse.poll;
      if (pollDetail && pollDetail.options && pollDetail.options.length > 0) {
        const totalVotes = pollDetail.totalVoteCount || 
                          pollDetail.totalVotes || 
                          pollDetail.options.reduce((sum, opt) => sum + (opt.voteCount || opt.votes || 0), 0);
        
        const pollOptions = pollDetail.options.map((opt) => {
          const votes = opt.voteCount || opt.votes || 0;
          return {
            id: opt.optionId || `option-${opt.text}`,
            text: opt.text || '',
            votes: Number(votes),
            percentage: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
          };
        });

        logger.debug('Using poll details from API:', {
          pollId,
          question: pollDetail.question,
          optionsCount: pollOptions.length,
          totalVotes,
        });

        const endedAt = pollDetail.endedAt || pollDetail.endDate;
        
        return {
          id: communityPost.postId || communityPost._id || '',
          question: pollDetail.question || '',
          options: pollOptions,
          totalVotes,
          endedAt: endedAt ? new Date(endedAt) : undefined,
          isFinished: pollDetail.isFinished ?? !!endedAt,
        };
      }
    } catch (error) {
      logger.error('Error fetching poll details:', error);
      // Continuar com fallback se a busca falhar
    }
  }

  // PRIORIDADE 2: Usar dados completos da poll de data.poll (nova estrutura do backend)
  if (communityPost.data?.poll) {
    const pollData = communityPost.data.poll;
    const question = pollData.question || 
      communityPost.data?.question || 
      communityPost.data?.title || 
      communityPost.data?.text || 
      '';
    
    if (!question) {
      return undefined;
    }

    // Se pollData já tem options, usar diretamente
    if (pollData.options && pollData.options.length > 0) {
      const totalVotes = pollData.totalVoteCount || 
                        pollData.totalVotes || 
                        pollData.options.reduce((sum, opt) => sum + (opt.voteCount || opt.votes || 0), 0);
      
      const pollOptions = pollData.options.map((opt) => {
        const votes = opt.voteCount || opt.votes || 0;
        return {
          id: opt.optionId || `option-${opt.text}`,
          text: opt.text || '',
          votes: Number(votes),
          percentage: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
        };
      });

      logger.debug('Using data.poll (new structure with options):', {
        postId: communityPost.postId || communityPost._id,
        question,
        optionsCount: pollOptions.length,
        totalVotes,
      });

      const endedAt = pollData.endedAt || pollData.endDate;
      
      return {
        id: communityPost.postId || communityPost._id || '',
        question,
        options: pollOptions,
        totalVotes,
        endedAt: endedAt ? new Date(endedAt) : undefined,
        isFinished: pollData.isFinished ?? !!endedAt,
      };
    }
  }

  // PRIORIDADE 2: Usar pollOptions (opções agrupadas)
  // PRIORIDADE 3: Usar childrenPosts
  const question = communityPost.data?.question || 
    communityPost.data?.title || 
    communityPost.data?.text || 
    '';
  
  if (!question) {
    return undefined;
  }

  let pollChildrenPosts: CommunityPost[] = [];
  
  if (communityPost.pollOptions && communityPost.pollOptions.length > 0) {
    // Nova estrutura: opções já vêm agrupadas no post
    pollChildrenPosts = communityPost.pollOptions;
    logger.debug('Using pollOptions (new structure):', {
      postId: communityPost.postId || communityPost._id,
      pollOptionsCount: pollChildrenPosts.length,
    });
  } else if (communityPost.childrenPosts && communityPost.childrenPosts.length > 0) {
    // Fallback: childrenPosts do post
    pollChildrenPosts = communityPost.childrenPosts;
    logger.debug('Using childrenPosts:', {
      postId: communityPost.postId || communityPost._id,
      childrenPostsCount: pollChildrenPosts.length,
    });
  }
  
  logger.debug('Poll childrenPosts:', {
    postId: communityPost.postId || communityPost._id,
    hasPollData: !!communityPost.data?.poll,
    hasPollOptions: !!communityPost.pollOptions,
    pollOptionsCount: communityPost.pollOptions?.length || 0,
    hasChildrenPosts: !!communityPost.childrenPosts,
    childrenPostsCount: communityPost.childrenPosts?.length || 0,
    finalCount: pollChildrenPosts.length,
  });

  // Se não encontrou opções, retornar undefined
  if (pollChildrenPosts.length === 0) {
    return undefined;
  }

  // Ordenar por sequenceNumber se disponível (nova estrutura)
  const sortedPollChildren = [...pollChildrenPosts].sort((a, b) => {
    const seqA = a.sequenceNumber ?? 0;
    const seqB = b.sequenceNumber ?? 0;
    return seqA - seqB;
  });

  // Mapear childrenPosts para opções do poll
  const pollOptions = sortedPollChildren.map((child, index) => {
    // Log detalhado para debug
    logger.debug('Mapping poll child to option:', {
      childId: child.postId || child._id,
      data: child.data,
      reactionsCount: child.reactionsCount,
      sequenceNumber: child.sequenceNumber,
    });

    // Tentar extrair texto da opção de diferentes lugares
    // Para opções de poll, o texto pode estar em:
    // 1. data.text (mais comum)
    // 2. data.title
    // 3. data.question
    // 4. metadata ou outros campos
    let optionText = child.data?.text || 
      child.data?.title || 
      child.data?.question ||
      (child as any).text ||
      (child as any).title ||
      (child as any).question;
    
     // Se ainda não encontrou, tentar buscar em metadata ou outros campos (se existir)
     if (!optionText && (child as any).metadata && typeof (child as any).metadata === 'object') {
       optionText = ((child as any).metadata as any).text || 
                    ((child as any).metadata as any).title || 
                    ((child as any).metadata as any).question;
     }
    
    // Se ainda não encontrou, tentar stringify do data (último recurso)
    if (!optionText && child.data && typeof child.data === 'object') {
      const dataKeys = Object.keys(child.data);
      // Se data tem apenas pollId, não usar stringify
      if (dataKeys.length > 1 || (dataKeys.length === 1 && dataKeys[0] !== 'pollId')) {
        optionText = JSON.stringify(child.data);
      }
    }
    
    // Fallback: usar índice
    if (!optionText || optionText.trim() === '') {
      optionText = `Opção ${index + 1}`;
      logger.warn('Poll option text not found, using fallback:', {
        childId: child.postId || child._id,
        index,
      });
    }
    
    // Calcular votos baseado em reactionsCount ou reactions
    const votes = child.reactionsCount || 
      (child.data?.votes !== undefined ? Number(child.data.votes) : 0) ||
      (child.data?.voteCount !== undefined ? Number(child.data.voteCount) : 0) ||
      0;
    
    logger.debug('Mapped poll option:', {
      id: child.postId || child._id || `option-${index}`,
      text: optionText,
      votes,
    });
    
    return {
      id: child.postId || child._id || `option-${index}`,
      text: optionText,
      votes: Number(votes),
      percentage: 0, // Será calculado depois
    };
  });

  // Calcular total de votos e percentuais
  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.votes, 0);
  const pollOptionsWithPercentage = pollOptions.map(opt => ({
    ...opt,
    percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
  }));

  const endedAt = communityPost.data?.poll?.endedAt || 
                  communityPost.data?.poll?.endDate ||
                  communityPost.data?.endedAt || 
                  communityPost.data?.endDate;
  const isFinished = communityPost.data?.poll?.isFinished ?? !!endedAt;

  return {
    id: communityPost.postId || communityPost._id || '',
    question,
    options: pollOptionsWithPercentage,
    totalVotes,
    endedAt: endedAt ? new Date(endedAt) : undefined,
    isFinished,
  };
};

export const mapCommunityPostToPost = async (
  communityPost: CommunityPost,
  files?: CommunityFile[],
  users?: CommunityUser[],
  comments?: CommunityComment[]
): Promise<Post | null> => {
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
  const poll = await mapCommunityPostToPoll(communityPost);

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

