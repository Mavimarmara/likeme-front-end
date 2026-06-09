import type { PostAttachmentKind } from '@/types';

type FileAttributes = {
  name?: string;
  extension?: string;
  mimeType?: string;
  metadata?: { thumbnail?: boolean; [key: string]: unknown };
};

type FileRowLike = {
  fileUrl?: string;
  url?: string;
  type?: string;
  attributes?: FileAttributes;
};

const SPREADSHEET_EXTENSIONS = new Set(['xls', 'xlsx', 'csv', 'ods']);
const DOCUMENT_EXTENSIONS = new Set(['doc', 'docx', 'txt', 'rtf', 'odt']);
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp']);

const SPREADSHEET_MIME_PREFIXES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml',
  'text/csv',
  'application/vnd.oasis.opendocument.spreadsheet',
];

const DOCUMENT_MIME_PREFIXES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml',
  'text/plain',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
];

function rowHttpUrl(row: FileRowLike | undefined): string {
  if (!row) return '';
  for (const key of ['fileUrl', 'url'] as const) {
    const v = row[key];
    if (typeof v === 'string' && v.trim().startsWith('http')) {
      return v.trim();
    }
  }
  return '';
}

function extensionFromUrl(url: string): string {
  const withoutQuery = url.split('?')[0] ?? url;
  const lastSegment = withoutQuery.split('/').pop() ?? '';
  const dot = lastSegment.lastIndexOf('.');
  if (dot <= 0 || dot === lastSegment.length - 1) return '';
  return lastSegment.slice(dot + 1).toLowerCase();
}

export function communityFileExtension(row: FileRowLike, url?: string): string {
  const fromAttributes = row.attributes?.extension?.trim().toLowerCase();
  if (fromAttributes) {
    return fromAttributes.replace(/^\./, '');
  }
  const resolvedUrl = url ?? rowHttpUrl(row);
  return extensionFromUrl(resolvedUrl);
}

export function communityFileDisplayName(row: FileRowLike, url?: string): string {
  const fromAttributes = row.attributes?.name?.trim();
  if (fromAttributes) {
    return fromAttributes;
  }
  const resolvedUrl = url ?? rowHttpUrl(row);
  if (!resolvedUrl) return 'Arquivo';
  const withoutQuery = resolvedUrl.split('?')[0] ?? resolvedUrl;
  const lastSegment = withoutQuery.split('/').pop() ?? '';
  if (lastSegment) {
    return decodeURIComponent(lastSegment);
  }
  return 'Arquivo';
}

export function communityFileMimeType(row: FileRowLike): string | undefined {
  const mime = row.attributes?.mimeType?.trim().toLowerCase();
  return mime || undefined;
}

export function communityFileIsThumbnail(row: FileRowLike): boolean {
  const meta = row.attributes?.metadata;
  if (meta && typeof meta === 'object' && meta.thumbnail === true) {
    return true;
  }
  const fileId = (row as { fileId?: string }).fileId;
  return typeof fileId === 'string' && fileId.includes('_thumbnail');
}

export function communityFileKind(row: FileRowLike, options?: { hintsVideo?: boolean }): PostAttachmentKind {
  const url = rowHttpUrl(row);
  const mime = communityFileMimeType(row) ?? '';
  const extension = communityFileExtension(row, url);

  if (options?.hintsVideo || mime.startsWith('video/') || /\.(mp4|webm|mov|m3u8)(\?|$)/i.test(url)) {
    return 'video';
  }

  if (communityFileIsThumbnail(row) && mime.startsWith('image/')) {
    return 'image';
  }

  if (mime.startsWith('image/') || IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (mime === 'application/pdf' || extension === 'pdf') {
    return 'pdf';
  }

  if (SPREADSHEET_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix)) || SPREADSHEET_EXTENSIONS.has(extension)) {
    return 'spreadsheet';
  }

  if (DOCUMENT_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix)) || DOCUMENT_EXTENSIONS.has(extension)) {
    return 'document';
  }

  const kindHint = String(row.type ?? '').toLowerCase();
  if (kindHint.includes('video')) return 'video';
  if (kindHint.includes('image')) return 'image';

  return 'generic';
}

export function communityFileKindIconName(kind: PostAttachmentKind): string {
  switch (kind) {
    case 'pdf':
      return 'picture-as-pdf';
    case 'spreadsheet':
      return 'grid-on';
    case 'document':
      return 'description';
    case 'video':
      return 'play-circle-outline';
    case 'image':
      return 'image';
    default:
      return 'insert-drive-file';
  }
}
