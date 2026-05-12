import type { AdvertiserDocument, AdvertiserDocumentType } from '@/types/ad';

const DOCUMENT_TYPE_ORDER: AdvertiserDocumentType[] = ['crm', 'rqe'];

const DOCUMENT_TYPE_LABEL: Record<AdvertiserDocumentType, string> = {
  crm: 'CRM',
  rqe: 'RQE',
};

export const formatAdvertiserDocumentsLine = (documents: AdvertiserDocument[] | undefined): string => {
  const orderIndex = new Map(DOCUMENT_TYPE_ORDER.map((type, index) => [type, index]));
  return [...(documents ?? [])]
    .sort((a, b) => (orderIndex.get(a.type) ?? 99) - (orderIndex.get(b.type) ?? 99))
    .map((document) => {
      const value = document.value?.trim();
      if (!value) {
        return null;
      }
      const typeLabel = DOCUMENT_TYPE_LABEL[document.type] ?? String(document.type).toUpperCase();
      return `${typeLabel} ${value}`;
    })
    .filter((segment): segment is string => Boolean(segment))
    .join(' | ');
};
