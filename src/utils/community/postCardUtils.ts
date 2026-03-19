import type { Post } from '@/types';

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

export const getFirstTagLabelFromPost = (post: Post): string | null => {
  if (!post.tags) return null;

  if (Array.isArray(post.tags)) {
    const validTag = post.tags.find((tag) => tag && typeof tag === 'string' && tag.toLowerCase() !== 'tags');
    return validTag || null;
  }

  if (typeof post.tags === 'string' && post.tags.toLowerCase() !== 'tags') {
    return post.tags;
  }

  return null;
};
