import { COMMUNITY_MEDIA_TEST_ID, communityMediaTestStub } from '@/constants/community/communityMediaTest';
import type { CommunityFeedData, UserFeedApiResponse, UserFeedParams } from '@/types/community';

const MOCK_USER_ID = 'mock-media-test-author';
const MOCK_CREATED_AT = '2026-06-08T12:00:00.000Z';

const MOCK_IMAGE_A = 'https://picsum.photos/seed/likeme-media-a/900/600';
const MOCK_IMAGE_B = 'https://picsum.photos/seed/likeme-media-b/900/700';
const MOCK_IMAGE_C = 'https://picsum.photos/seed/likeme-media-c/900/500';
const MOCK_IMAGE_D = 'https://picsum.photos/seed/likeme-media-d/900/650';
const MOCK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const MOCK_VIDEO_POSTER = 'https://picsum.photos/seed/likeme-video-poster/1280/720';
const MOCK_PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

function communityTarget() {
  return {
    targetId: COMMUNITY_MEDIA_TEST_ID,
    targetType: 'community',
  };
}

export function variedMediaTestFeedData(): CommunityFeedData {
  return {
    posts: [
      {
        postId: 'mock-post-single-image',
        postedUserId: MOCK_USER_ID,
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Imagem única',
          text: 'Post só com uma foto antes do texto.',
          fileId: 'mock-file-img-a',
        },
        ...communityTarget(),
      },
      {
        postId: 'mock-post-multi-image',
        postedUserId: MOCK_USER_ID,
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Várias imagens',
          text: 'Grade com múltiplas fotos no topo do post.',
        },
        childrenPosts: [
          {
            postId: 'mock-child-img-a',
            sequenceNumber: 1,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-img-a' },
          },
          {
            postId: 'mock-child-img-b',
            sequenceNumber: 2,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-img-b' },
          },
          {
            postId: 'mock-child-img-c',
            sequenceNumber: 3,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-img-c' },
          },
          {
            postId: 'mock-child-img-d',
            sequenceNumber: 4,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-img-d' },
          },
        ],
        ...communityTarget(),
      },
      {
        postId: 'mock-post-video',
        postedUserId: MOCK_USER_ID,
        createdAt: MOCK_CREATED_AT,
        structureType: 'video',
        data: {
          title: '[Mock] Vídeo',
          text: 'Vídeo após o texto com poster dedicado.',
          fileId: 'mock-file-video-1',
        },
        ...communityTarget(),
      },
      {
        postId: 'mock-post-images-and-video',
        postedUserId: MOCK_USER_ID,
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Imagens + vídeo',
          text: 'Cenário que costuma quebrar: várias imagens e vídeo no mesmo post.',
        },
        childrenPosts: [
          {
            postId: 'mock-child-mix-img-a',
            sequenceNumber: 1,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-img-a' },
          },
          {
            postId: 'mock-child-mix-img-b',
            sequenceNumber: 2,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-img-b' },
          },
          {
            postId: 'mock-child-mix-video',
            sequenceNumber: 3,
            structureType: 'video',
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-video-2' },
          },
        ],
        ...communityTarget(),
      },
      {
        postId: 'mock-post-image-pdf',
        postedUserId: MOCK_USER_ID,
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Imagem + PDF',
          text: 'Layout Figma: foto à esquerda e card de download na coluna lateral.',
          fileId: 'mock-file-img-a',
        },
        childrenPosts: [
          {
            postId: 'mock-child-image-pdf-file',
            sequenceNumber: 2,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-file-pdf-1' },
          },
        ],
        ...communityTarget(),
      },
      {
        postId: 'mock-post-pdf',
        postedUserId: MOCK_USER_ID,
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Arquivo PDF',
          text: 'Download de material em PDF no final do post.',
          fileId: 'mock-file-pdf-1',
        },
        ...communityTarget(),
      },
    ],
    postChildren: [],
    comments: [],
    users: [
      {
        userId: MOCK_USER_ID,
        displayName: 'QA Mídia',
      },
    ],
    files: [
      {
        fileId: 'mock-file-img-a',
        fileUrl: MOCK_IMAGE_A,
        attributes: { mimeType: 'image/jpeg', name: 'foto-a.jpg' },
      },
      {
        fileId: 'mock-file-img-b',
        fileUrl: MOCK_IMAGE_B,
        attributes: { mimeType: 'image/jpeg', name: 'foto-b.jpg' },
      },
      {
        fileId: 'mock-file-img-c',
        fileUrl: MOCK_IMAGE_C,
        attributes: { mimeType: 'image/jpeg', name: 'foto-c.jpg' },
      },
      {
        fileId: 'mock-file-img-d',
        fileUrl: MOCK_IMAGE_D,
        attributes: { mimeType: 'image/jpeg', name: 'foto-d.jpg' },
      },
      {
        fileId: 'mock-file-video-1',
        fileUrl: MOCK_VIDEO_URL,
        attributes: { mimeType: 'video/mp4', name: 'clip-1.mp4' },
      },
      {
        fileId: 'mock-file-video-1_thumbnail_1',
        fileUrl: MOCK_VIDEO_POSTER,
        attributes: { mimeType: 'image/jpeg', metadata: { thumbnail: true } },
      },
      {
        fileId: 'mock-file-video-2',
        fileUrl: MOCK_VIDEO_URL,
        attributes: { mimeType: 'video/mp4', name: 'clip-2.mp4' },
      },
      {
        fileId: 'mock-file-video-2_thumbnail_1',
        fileUrl: MOCK_VIDEO_POSTER,
        attributes: { mimeType: 'image/jpeg', metadata: { thumbnail: true } },
      },
      {
        fileId: 'mock-file-pdf-1',
        fileUrl: MOCK_PDF_URL,
        attributes: { mimeType: 'application/pdf', name: 'material.pdf' },
      },
    ],
    communities: [communityMediaTestStub()],
    communityUsers: [],
    categories: [],
    paging: {},
  };
}

export function shouldUseVariedMediaFeedMock(params: UserFeedParams): boolean {
  return __DEV__ && params.communityId?.trim() === COMMUNITY_MEDIA_TEST_ID;
}

export function variedMediaTestFeedApiResponse(params: UserFeedParams = {}): UserFeedApiResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  if (page > 1) {
    return {
      success: true,
      data: {
        status: 'ok',
        data: {
          posts: [],
          postChildren: [],
          comments: [],
          users: [],
          files: [],
          communities: [],
          communityUsers: [],
          categories: [],
          paging: {},
        },
        pagination: {
          page,
          limit,
          total: variedMediaTestFeedData().posts?.length ?? 0,
          totalPages: 1,
        },
      },
    };
  }

  const feedData = variedMediaTestFeedData();
  const total = feedData.posts?.length ?? 0;

  return {
    success: true,
    data: {
      status: 'ok',
      data: feedData,
      pagination: {
        page: 1,
        limit,
        total,
        totalPages: 1,
      },
    },
  };
}
