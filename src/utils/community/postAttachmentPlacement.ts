import type { Post, PostAttachment } from '@/types';

const FILE_KINDS = new Set<PostAttachment['kind']>(['pdf', 'spreadsheet', 'document', 'generic']);

export type PostAttachmentPlacement = 'beforeText' | 'afterText' | 'endOfPost' | 'all';

function legacyAttachmentsFromPost(post: Pick<Post, 'id' | 'image' | 'videoUrl'>): PostAttachment[] {
  const out: PostAttachment[] = [];
  const imageUri = post.image?.trim();
  const videoUri = post.videoUrl?.trim();

  if (imageUri) {
    out.push({
      id: `${post.id}-legacy-image`,
      url: imageUri,
      kind: 'image',
      fileName: 'Imagem',
      extension: '',
    });
  }

  if (videoUri) {
    out.push({
      id: `${post.id}-legacy-video`,
      url: videoUri,
      kind: 'video',
      fileName: 'Vídeo',
      extension: '',
      posterUrl: imageUri,
    });
  }

  return out;
}

export function postAttachmentsForPlacement(post: Pick<Post, 'id' | 'image' | 'videoUrl' | 'attachments'>) {
  const attachments = post.attachments?.length ? post.attachments : legacyAttachmentsFromPost(post);
  const images = attachments.filter((item) => item.kind === 'image');
  const videos = attachments.filter((item) => item.kind === 'video');
  const files = attachments.filter((item) => FILE_KINDS.has(item.kind));

  return {
    attachments,
    images,
    videos,
    files,
    hasVideo: videos.length > 0,
  };
}

export function postHasBeforeTextAttachments(post: Pick<Post, 'id' | 'image' | 'videoUrl' | 'attachments'>): boolean {
  return postAttachmentsForPlacement(post).images.length > 0;
}

export function postHasAfterTextAttachments(post: Pick<Post, 'id' | 'image' | 'videoUrl' | 'attachments'>): boolean {
  return postAttachmentsForPlacement(post).hasVideo;
}

export function postHasEndOfPostAttachments(post: Pick<Post, 'id' | 'image' | 'videoUrl' | 'attachments'>): boolean {
  return postAttachmentsForPlacement(post).files.length > 0;
}

export function placementHasAttachments(
  placement: PostAttachmentPlacement,
  post: Pick<Post, 'id' | 'image' | 'videoUrl' | 'attachments'>,
): boolean {
  if (placement === 'all') {
    return postHasBeforeTextAttachments(post) || postHasAfterTextAttachments(post) || postHasEndOfPostAttachments(post);
  }
  if (placement === 'beforeText') {
    return postHasBeforeTextAttachments(post);
  }
  if (placement === 'afterText') {
    return postHasAfterTextAttachments(post);
  }
  return postHasEndOfPostAttachments(post);
}
