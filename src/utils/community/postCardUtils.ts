import type { Post } from '@/types';

/** Compatível com `t` do `useTranslation()` (react-i18next) sem acoplar ao brand do i18next `TFunction`. */
export type PostFeedTranslateFn = (key: string) => string;

export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getTitleFromPost = (post: Post): string => {
  if (post.title) return post.title;

  const lines = post.content.split('\n').filter((line) => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 30 && firstLine.length < 150) {
      return firstLine;
    }
  }

  const sentences = post.content.split(/[.!?]/).filter((s) => s.trim());
  if (sentences.length > 0) {
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 30 && firstSentence.length < 150) {
      return firstSentence;
    }
  }

  const truncated = post.content.substring(0, 120).trim();
  if (truncated.length >= 30) {
    return truncated;
  }

  return post.content.substring(0, 100);
};

export const getContentPreviewFromPost = (post: Post): string => {
  if (!post.content) return '';

  const title = getTitleFromPost(post);
  let remaining = post.content;

  if (post.title && post.content.startsWith(post.title)) {
    remaining = post.content.substring(post.title.length).trim();
  } else if (post.content.startsWith(title)) {
    remaining = post.content.substring(title.length).trim();
  }

  return remaining.length > 0 ? remaining : '';
};

const normalizeKey = (s: string) => s.trim().toLowerCase();

const SPECIALIST_TAG_MARKERS = ['especialista', 'specialist', 'expert'] as const;

const postTagsAsList = (post: Post): string[] => {
  if (!post.tags) return [];
  return Array.isArray(post.tags) ? post.tags : [post.tags];
};

const isSpecialistTagPost = (post: Post): boolean =>
  postTagsAsList(post).some((tag) => {
    if (!tag || typeof tag !== 'string') return false;
    const n = normalizeKey(tag);
    if (n === 'tags') return false;
    return SPECIALIST_TAG_MARKERS.some((m) => n === m || n.includes(m));
  });

const firstDisplayTag = (post: Post): string | null => {
  const valid = postTagsAsList(post).find((tag) => tag && typeof tag === 'string' && normalizeKey(tag) !== 'tags');
  return valid ?? null;
};

/** Tipos genéricos do feed que não devem virar rótulo de “tipo de post” */
const GENERIC_FEED_TYPE_KEYS = new Set(['community', 'user', 'post']);

const FEED_TYPE_I18N_KEYS: Record<string, string> = {
  poll: 'community.postType.poll',
  text: 'community.postType.forum',
  forum: 'community.postType.forum',
  livestream: 'community.postType.live',
  live: 'community.postType.live',
  image: 'community.postType.image',
  file: 'community.postType.file',
  video: 'community.postType.video',
  audio: 'community.postType.audio',
  story: 'community.postType.story',
  content: 'community.postType.content',
  specialist: 'community.specialistLabel',
  expert: 'community.specialistLabel',
};

export const getPostContentTypeLabel = (post: Post, t: PostFeedTranslateFn): string => {
  const overline = post.overline?.trim();
  if (overline) return overline;

  if (post.poll) return t('community.postType.poll');

  if (isSpecialistTagPost(post)) return t('community.specialistLabel');

  const typeKey = post.feedPostType?.trim().toLowerCase() ?? '';
  if (typeKey && !GENERIC_FEED_TYPE_KEYS.has(typeKey) && FEED_TYPE_I18N_KEYS[typeKey]) {
    return t(FEED_TYPE_I18N_KEYS[typeKey]);
  }

  const tag = firstDisplayTag(post);
  if (tag) return tag;

  if (typeKey && !GENERIC_FEED_TYPE_KEYS.has(typeKey)) {
    return typeKey.charAt(0).toUpperCase() + typeKey.slice(1).toLowerCase();
  }

  return t('community.postType.general');
};

export type PostTypeBadgeColor = 'blue' | 'orange' | 'lime' | 'beige';

export const getPostTypeBadgeColor = (post: Post): PostTypeBadgeColor => {
  if (post.poll) return 'orange';
  const k = post.feedPostType?.toLowerCase() ?? '';
  if (k === 'poll') return 'orange';
  if (k === 'livestream' || k === 'live') return 'lime';
  if (k === 'text' || k === 'forum') return 'blue';
  if (isSpecialistTagPost(post)) return 'blue';
  return 'beige';
};

export const getFirstTagLabelFromPost = (post: Post): string | null => {
  return firstDisplayTag(post);
};
