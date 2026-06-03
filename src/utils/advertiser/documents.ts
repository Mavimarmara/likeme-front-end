import type { AdvertiserDocument } from '@/types/ad';

export const formatAdvertiserDocumentsLine = (documents: AdvertiserDocument[] | undefined): string => {
  return [...(documents ?? [])]
    .map((document) => document.value?.trim())
    .filter((value): value is string => Boolean(value))
    .join(' | ');
};
