export interface CommunityPost {
  id: string;
  postId?: string;
  parentPostId?: string;
  userId?: string;
  userPublicId?: string;
  communityId?: string;
  data?: {
    text?: string;
    title?: string;
    fileId?: string;
    thumbnailFileId?: string;
  };
  reactionsCount?: number;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityFile {
  fileId?: string;
  fileUrl?: string;
  type?: string;
}

export interface CommunityFeedData {
  posts?: CommunityPost[];
  files?: CommunityFile[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export interface UserFeedApiResponse {
  success: boolean;
  status?: string;
  data?: CommunityFeedData;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface UserFeedParams {
  page?: number;
  limit?: number;
}

