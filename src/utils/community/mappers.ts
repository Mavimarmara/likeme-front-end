import type { CommunityPost, CommunityFile, CommunityUser } from '@/types/community';
import type { Post } from '@/types';
import { logger } from '@/utils/logger';

export const mapCommunityPostToPost = (
  communityPost: CommunityPost,
  files?: CommunityFile[],
  users?: CommunityUser[]
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
  const comments: Post['comments'] = [];

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

  const post: Post = {
    id: postId,
    userId: userId,
    content,
    image: imageUrl,
    likes,
    comments,
    createdAt: new Date(communityPost.createdAt),
    category: (communityPost as any).category || (communityPost as any).dataType || undefined,
    overline: (communityPost as any).overline || undefined,
    title: communityPost.data?.title || undefined,
    userName,
    userAvatar,
  };

  logger.debug('Mapped post:', { 
    postId: post.id, 
    userId: post.userId, 
    contentLength: post.content.length,
    hasImage: !!post.image,
    likes: post.likes,
    originalPost: {
      _id: communityPost._id,
      postId: communityPost.postId,
      postedUserId: communityPost.postedUserId,
      userId: communityPost.userId,
      dataType: (communityPost as any).dataType,
      data: communityPost.data,
    }
  });

  return post;
};

