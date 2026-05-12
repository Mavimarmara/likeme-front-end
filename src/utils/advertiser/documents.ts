import type { AdvertiserDocument, AdvertiserDocumentType } from '@/types/ad';

const DOCUMENT_TYPE_ORDER: AdvertiserDocumentType[] = ['crm', 'rqe'];

export const formatAdvertiserDocumentsLine = (documents: AdvertiserDocument[] | undefined): string => {
  const orderIndex = new Map(DOCUMENT_TYPE_ORDER.map((type, index) => [type, index]));
  return [...(documents ?? [])]
    .sort((a, b) => (orderIndex.get(a.type) ?? 99) - (orderIndex.get(b.type) ?? 99))
    .map((document) => document.value?.trim())
    .filter((value): value is string => Boolean(value))
    .join(' | ');
};
