export interface CommunityPost {
  _id?: string;
  postId?: string;
  parentPostId?: string;
  postedUserId?: string;
  userId?: string;
  targetId?: string;
  targetType?: string;
  structureType?: string;
  tags?: string | string[];
  data?: {
    text?: string;
    title?: string;
    fileId?: string;
    thumbnailFileId?: string;
    question?: string;
    options?: Array<{
      id?: string;
      text?: string;
      votes?: number;
      voteCount?: number;
      [key: string]: unknown;
    }>;
    endedAt?: string;
    endDate?: string;
    tags?: string | string[];
    [key: string]: unknown;
  };
  reactionsCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityFile {
  fileId: string;
  fileUrl: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityComment {
  commentId: string;
  userId: string;
  referenceId?: string;
  data?: {
    text?: string;
    [key: string]: unknown;
  };
  reactionsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityUser {
  userId: string;
  displayName: string;
  avatarFileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Community {
  communityId: string;
  displayName: string;
  description?: string;
  avatarFileId?: string;
  isPublic: boolean;
  membersCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityUserRelation {
  userId: string;
  communityId: string;
  communityMembership: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityCategory {
  categoryId: string;
  name: string;
  avatarFileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityFeedData {
  posts?: CommunityPost[];
  postChildren?: CommunityPost[];
  comments?: CommunityComment[];
  users?: CommunityUser[];
  files?: CommunityFile[];
  communities?: Community[];
  communityUsers?: CommunityUserRelation[];
  categories?: CommunityCategory[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export interface UserFeedApiResponse {
  success?: boolean;
  status?: string;
  data?: {
    status?: string;
    data?: CommunityFeedData;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
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
  search?: string;
}

