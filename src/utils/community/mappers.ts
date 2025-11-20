import type { CommunityPost, CommunityFile } from '@/types/community';
import type { Post } from '@/types';

export const mapCommunityPostToPost = (
  communityPost: CommunityPost,
  files?: CommunityFile[]
): Post => {
  let imageUrl: string | undefined;
  if (communityPost.data?.fileId && files) {
    const file = files.find(f => f.fileId === communityPost.data?.fileId);
    imageUrl = file?.fileUrl;
  }

  const likes = communityPost.reactionsCount || 0;
  const comments: Post['comments'] = [];

  return {
    id: communityPost.postId || communityPost.id || '',
    userId: communityPost.userId || communityPost.userPublicId || '',
    content: communityPost.data?.text || communityPost.data?.title || '',
    image: imageUrl,
    likes,
    comments,
    createdAt: communityPost.createdAt ? new Date(communityPost.createdAt) : new Date(),
  };
};

