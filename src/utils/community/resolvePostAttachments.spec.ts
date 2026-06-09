import type { CommunityFile, CommunityPost } from '@/types/community';
import { resolveCommunityPostAttachmentsWithChildren } from '@/utils/community/resolvePostAttachments';

describe('resolveCommunityPostAttachmentsWithChildren', () => {
  it('retorna PDF como anexo de arquivo, não imagem', () => {
    const communityPost: CommunityPost = {
      postId: 'p-pdf',
      createdAt: '2026-01-01T00:00:00.000Z',
      data: { text: 'Material', fileId: 'doc-1' },
    } as CommunityPost;

    const files: CommunityFile[] = [
      {
        fileId: 'doc-1',
        fileUrl: 'https://cdn.example.com/material.pdf',
        attributes: { mimeType: 'application/pdf', name: 'material.pdf' },
      } as CommunityFile,
    ];

    const attachments = resolveCommunityPostAttachmentsWithChildren(communityPost, files);

    expect(attachments).toHaveLength(1);
    expect(attachments[0]?.kind).toBe('pdf');
    expect(attachments[0]?.fileName).toBe('material.pdf');
  });

  it('agrega múltiplos anexos de posts filhos', () => {
    const parent: CommunityPost = {
      postId: 'p-parent',
      createdAt: '2026-01-01T00:00:00.000Z',
      data: { text: 'Combo' },
      childrenPosts: [
        {
          postId: 'p-image',
          sequenceNumber: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
          data: { fileId: 'img-1' },
        } as CommunityPost,
        {
          postId: 'p-doc',
          sequenceNumber: 2,
          createdAt: '2026-01-01T00:00:00.000Z',
          data: { fileId: 'doc-1' },
        } as CommunityPost,
      ],
    } as CommunityPost;

    const files: CommunityFile[] = [
      {
        fileId: 'img-1',
        fileUrl: 'https://cdn.example.com/photo.png',
        attributes: { mimeType: 'image/png' },
      } as CommunityFile,
      {
        fileId: 'doc-1',
        fileUrl: 'https://cdn.example.com/plano.xlsx',
        attributes: {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          name: 'plano.xlsx',
        },
      } as CommunityFile,
    ];

    const attachments = resolveCommunityPostAttachmentsWithChildren(parent, files);

    expect(attachments.map((item) => item.kind)).toEqual(['image', 'spreadsheet']);
  });

  it('não duplica thumbnail de vídeo como imagem separada', () => {
    const videoId = 'vid-1';
    const communityPost: CommunityPost = {
      postId: 'p-video',
      createdAt: '2026-01-01T00:00:00.000Z',
      data: { text: 'Vídeo', fileId: videoId },
    } as CommunityPost;

    const files: CommunityFile[] = [
      {
        fileId: videoId,
        fileUrl: 'https://cdn.example.com/clip.mp4',
        attributes: { mimeType: 'video/mp4' },
      } as CommunityFile,
      {
        fileId: `${videoId}_thumbnail_1`,
        fileUrl: 'https://cdn.example.com/clip_thumb.jpg',
        attributes: { mimeType: 'image/jpeg', metadata: { thumbnail: true } },
      } as CommunityFile,
    ];

    const attachments = resolveCommunityPostAttachmentsWithChildren(communityPost, files);

    expect(attachments).toHaveLength(1);
    expect(attachments[0]?.kind).toBe('video');
    expect(attachments[0]?.posterUrl).toBe('https://cdn.example.com/clip_thumb.jpg');
  });
});
