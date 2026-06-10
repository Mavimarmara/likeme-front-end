export const POST_SINGLE_IMAGE_ASPECT = 284 / 483;
export const POST_VIDEO_POSTER_ASPECT = 282 / 660;

export type PostImageGridLayout = 'single' | 'pair' | 'triple' | 'quad';

export function postImageGridLayout(imageCount: number): PostImageGridLayout {
  if (imageCount <= 1) return 'single';
  if (imageCount === 2) return 'pair';
  if (imageCount === 3) return 'triple';
  return 'quad';
}

export function postImageGridMoreCount(imageCount: number): number | null {
  if (imageCount <= 4) return null;
  return imageCount - 4;
}
