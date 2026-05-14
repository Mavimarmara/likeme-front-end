import type { CommunityPost } from '@/types/community';
import { resolveCommunityPostMedia } from '@/utils/community/resolvePostMedia';

describe('resolveCommunityPostMedia (qualidade mídia)', () => {
  it('prefere 1080p a 480p em data.videoUrl', () => {
    const r = resolveCommunityPostMedia({
      data: {
        type: 'video',
        videoUrl: {
          '480p': 'https://cdn.example.com/v480.mp4',
          '1080p': 'https://cdn.example.com/v1080.mp4',
        },
      },
      structureType: 'video',
    } as CommunityPost);

    expect(r.videoUrl).toBe('https://cdn.example.com/v1080.mp4');
  });

  it('prefere original quando presente em data.videoUrl', () => {
    const r = resolveCommunityPostMedia({
      data: {
        type: 'video',
        videoUrl: {
          '720p': 'https://cdn.example.com/v720.mp4',
          original: 'https://cdn.example.com/vorig.mp4',
        },
      },
      structureType: 'video',
    } as CommunityPost);

    expect(r.videoUrl).toBe('https://cdn.example.com/vorig.mp4');
  });

  it('prefere fullImage a smallImage em data.image aninhado', () => {
    const r = resolveCommunityPostMedia({
      data: {
        image: {
          smallImage: { fileUrl: 'https://cdn.example.com/small.jpg' },
          fullImage: { fileUrl: 'https://cdn.example.com/full.jpg' },
        },
      },
    } as CommunityPost);

    expect(r.imageUrl).toBe('https://cdn.example.com/full.jpg');
  });

  it('prefere fileId original a medium em videoFileId + files', () => {
    const post = {
      postId: 'p-q',
      data: {
        type: 'video',
        videoFileId: {
          original: 'vid-orig',
          medium: 'vid-med',
        },
      },
      structureType: 'video',
      files: [
        {
          fileId: 'vid-med',
          fileUrl: 'https://cdn.example.com/med.mp4',
          attributes: { mimeType: 'video/mp4' },
          videoUrl: { '480p': 'https://cdn.example.com/med480.mp4' },
        },
        {
          fileId: 'vid-orig',
          fileUrl: 'https://cdn.example.com/orig.mp4',
          attributes: { mimeType: 'video/mp4' },
          videoUrl: { '1080p': 'https://cdn.example.com/orig1080.mp4' },
        },
      ],
    } as CommunityPost;

    const r = resolveCommunityPostMedia(post);
    expect(r.videoUrl).toBe('https://cdn.example.com/orig1080.mp4');
  });
});
