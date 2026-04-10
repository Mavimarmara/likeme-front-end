import type { CommunityFile, CommunityPost } from '@/types/community';

export type ResolvedPostMedia = {
  imageUrl?: string;
  videoUrl?: string;
};

const VIDEO_FILE_ID_QUALITIES = ['medium', 'high', 'original', 'low'] as const;

type VideoFileIdMap = Partial<Record<(typeof VIDEO_FILE_ID_QUALITIES)[number], string>>;

type FeedFileRow = Record<string, unknown>;

function mergeFeedFileSources(rootFiles: CommunityFile[] | undefined, post: { files?: unknown[] }): FeedFileRow[] {
  const out: FeedFileRow[] = [];
  const seen = new Set<string>();

  const push = (raw: unknown) => {
    if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return;
    const r = raw as FeedFileRow;
    const idRaw = r.fileId ?? r._id ?? r.id;
    const id = typeof idRaw === 'string' && idRaw.trim() ? idRaw.trim() : undefined;
    const key = id ?? `__idx_${out.length}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(r);
  };

  (rootFiles ?? []).forEach(push);
  (post.files ?? []).forEach(push);
  return out;
}

function rowUrl(row: FeedFileRow | undefined): string | undefined {
  if (!row) return undefined;
  const pick = (key: string): string | undefined => {
    const v = row[key];
    return typeof v === 'string' && v.trim() ? v.trim() : undefined;
  };
  const preferHttp = (u: string): string | undefined => {
    if (u.startsWith('http')) return u;
    if (u.startsWith('//')) return `https:${u}`;
    return undefined;
  };
  for (const key of ['fileUrl', 'url', 'downloadUrl', 'src'] as const) {
    const u = pick(key);
    if (!u) continue;
    const abs = preferHttp(u);
    if (abs) return abs;
  }
  for (const key of ['fileUrl', 'url', 'downloadUrl', 'src'] as const) {
    const u = pick(key);
    if (u) return u;
  }
  return undefined;
}

function lookupRowByFileId(id: string | undefined, rows: FeedFileRow[]): FeedFileRow | undefined {
  if (!id?.trim() || rows.length === 0) return undefined;
  const trimmed = id.trim();
  return rows.find((r) => {
    const candidates = [r.fileId, r._id, r.id].filter((x): x is string => typeof x === 'string');
    return candidates.some((x) => x.trim() === trimmed);
  });
}

function lookupUrlByFileId(id: string | undefined, rows: FeedFileRow[]): string | undefined {
  return rowUrl(lookupRowByFileId(id, rows));
}

/** Social Plus / Amity: objeto `videoUrl` com chaves 720p, 480p, original, etc. */
const VIDEO_DIRECT_URL_KEYS = ['720p', '480p', '1080p', '360p', 'original', 'medium', 'high', 'low'] as const;

function pickHttpUrlFromVideoUrlObject(o: Record<string, unknown>): string | undefined {
  for (const k of VIDEO_DIRECT_URL_KEYS) {
    const v = o[k];
    if (typeof v === 'string' && v.trim().startsWith('http')) {
      return v.trim();
    }
  }
  for (const v of Object.values(o)) {
    if (typeof v === 'string' && v.trim().startsWith('http') && /\.(mp4|webm|mov)(\?|$)/i.test(v.trim())) {
      return v.trim();
    }
  }
  return undefined;
}

/** Amity envia `videoUrl` no item de `files` (mapa 720p, 480p, …), não só em `post.data`. */
function pickVideoPlaybackUrlFromFileRow(row: FeedFileRow | undefined): string | undefined {
  if (!row) return undefined;
  const raw = row.videoUrl;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const u = pickHttpUrlFromVideoUrlObject(raw as Record<string, unknown>);
    if (u) return u;
  }
  return rowUrl(row);
}

/** Miniatura de vídeo Amity: outro registro em `files` com `fileId` tipo `…_thumbnail.…` e/ou `metadata.thumbnail`. */
function findThumbnailUrlForVideoBaseId(videoBaseFileId: string, rows: FeedFileRow[]): string | undefined {
  const base = videoBaseFileId.trim();
  if (!base) return undefined;
  for (const r of rows) {
    const fid = typeof r.fileId === 'string' ? r.fileId.trim() : '';
    if (!fid || fid === base) continue;
    if (!fid.startsWith(base)) continue;
    const attr = r.attributes as { mimeType?: string; metadata?: { thumbnail?: boolean } } | undefined;
    const mime = attr?.mimeType?.toLowerCase() ?? '';
    const isThumbMeta = attr?.metadata?.thumbnail === true;
    if (mime.startsWith('image/') || isThumbMeta || fid.includes('_thumbnail')) {
      const u = rowUrl(r);
      if (u) return u;
    }
  }
  return undefined;
}

function isVideoRow(row: FeedFileRow | undefined): boolean {
  if (!row) return false;
  const attr = row.attributes;
  if (attr && typeof attr === 'object' && attr !== null && !Array.isArray(attr)) {
    const meta = (attr as { metadata?: { thumbnail?: unknown } }).metadata;
    if (meta && typeof meta === 'object' && meta !== null && meta.thumbnail === true) {
      return false;
    }
    const mime = (attr as { mimeType?: unknown }).mimeType;
    if (typeof mime === 'string' && mime.toLowerCase().startsWith('image/')) {
      return false;
    }
    if (typeof mime === 'string' && mime.toLowerCase().startsWith('video/')) return true;
  }
  const kind = String(row.type ?? '').toLowerCase();
  if (kind.includes('video')) {
    return true;
  }
  const u = rowUrl(row) ?? '';
  return /\.(mp4|webm|mov|m3u8)(\?|$)/i.test(u);
}

function extractFileIdFromField(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  if (typeof raw === 'string') {
    const t = raw.trim();
    return t || undefined;
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const o = raw as FeedFileRow;
  const nested = o.fileId ?? o.file_id ?? o.id ?? o._id;
  return typeof nested === 'string' && nested.trim() ? nested.trim() : undefined;
}

function nestedImageFileUrl(val: unknown): string | undefined {
  if (val == null) return undefined;
  if (typeof val === 'string' && val.trim().startsWith('http')) return val.trim();
  if (typeof val !== 'object' || Array.isArray(val)) return undefined;
  const o = val as FeedFileRow;
  const u = o.fileUrl ?? o.url;
  return typeof u === 'string' && u.trim() ? u.trim() : undefined;
}

function extractDirectImageUrl(dataObj: Record<string, unknown>): string | undefined {
  const flatKeys = ['imageUrl', 'photoUrl'] as const;
  for (const k of flatKeys) {
    const v = dataObj[k];
    if (typeof v === 'string' && v.trim().startsWith('http')) return v.trim();
  }
  const imageGroupKeys = ['fullImage', 'largeImage', 'mediumImage', 'smallImage', 'thumbnailImage'] as const;
  for (const k of imageGroupKeys) {
    const u = nestedImageFileUrl(dataObj[k]);
    if (u) return u;
  }
  return undefined;
}

function parseVideoFileIdField(raw: unknown): VideoFileIdMap | undefined {
  if (raw == null) return undefined;
  if (typeof raw === 'string') {
    const t = raw.trim();
    return t ? { original: t } : undefined;
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  const pick = (k: string): string | undefined => {
    const v = o[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return extractFileIdFromField(v);
    }
    return undefined;
  };
  const out: VideoFileIdMap = {
    original: pick('original'),
    low: pick('low'),
    medium: pick('medium'),
    high: pick('high'),
  };
  return Object.values(out).some(Boolean) ? out : undefined;
}

function resolveVideoUrlFromIdMap(ids: VideoFileIdMap, rows: FeedFileRow[]): string | undefined {
  for (const q of VIDEO_FILE_ID_QUALITIES) {
    const id = ids[q];
    if (!id) continue;
    const row = lookupRowByFileId(id, rows);
    if (row && isVideoRow(row)) {
      const fromTranscode = pickVideoPlaybackUrlFromFileRow(row);
      if (fromTranscode) return fromTranscode;
    }
    const url = lookupUrlByFileId(id, rows);
    if (url) return url;
  }
  return undefined;
}

function isCommunityPostLike(item: unknown): item is CommunityPost {
  return (
    item != null &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    ('data' in item || 'postId' in item || '_id' in item)
  );
}

function collectChildPostsForParent(
  parent: Pick<CommunityPost, 'postId' | '_id' | 'path' | 'children' | 'childrenPosts'>,
  postChildren?: CommunityPost[],
  feedPosts?: CommunityPost[],
): CommunityPost[] {
  const byId = new Map<string, CommunityPost>();
  const add = (c: CommunityPost) => {
    const id = c.postId || c._id;
    if (id) {
      byId.set(id, c);
    }
  };

  const parentKeys = new Set(
    [parent.postId, parent._id, parent.path].filter((x): x is string => typeof x === 'string' && x.length > 0),
  );

  for (const c of postChildren ?? []) {
    if (c.parentPostId && parentKeys.has(c.parentPostId)) {
      add(c);
    }
  }

  const embedded = parent.children;
  if (Array.isArray(embedded)) {
    for (const item of embedded) {
      if (typeof item === 'string') {
        const id = item.trim();
        if (!id || !feedPosts?.length) continue;
        const match = feedPosts.find((p) => p.postId === id || p._id === id);
        if (match) add(match);
        continue;
      }
      if (isCommunityPostLike(item)) {
        add(item);
      }
    }
  }

  const nestedChildrenPosts = parent.childrenPosts;
  if (Array.isArray(nestedChildrenPosts)) {
    for (const item of nestedChildrenPosts) {
      if (isCommunityPostLike(item)) {
        add(item);
      }
    }
  }

  const list = Array.from(byId.values());
  list.sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0));
  return list;
}

export function resolveCommunityPostMediaWithChildren(
  communityPost: Pick<
    CommunityPost,
    'data' | 'structureType' | 'dataType' | 'postId' | '_id' | 'path' | 'files' | 'children' | 'childrenPosts'
  >,
  files?: CommunityFile[],
  postChildren?: CommunityPost[],
  feedPosts?: CommunityPost[],
): ResolvedPostMedia {
  const isPollPost =
    communityPost.structureType === 'poll' ||
    (typeof communityPost.dataType === 'string' && communityPost.dataType.toLowerCase() === 'poll');

  if (isPollPost) {
    return resolveCommunityPostMedia(communityPost, files);
  }

  const fromParent = resolveCommunityPostMedia(communityPost, files);
  let { imageUrl, videoUrl } = fromParent;

  if (imageUrl && videoUrl) {
    return fromParent;
  }

  const childList = collectChildPostsForParent(communityPost, postChildren, feedPosts);
  for (const child of childList) {
    if (child.structureType === 'poll') {
      continue;
    }
    const r = resolveCommunityPostMedia(child, files);
    if (r.videoUrl) {
      videoUrl = videoUrl || r.videoUrl;
      imageUrl = imageUrl || r.imageUrl;
    } else if (r.imageUrl) {
      imageUrl = imageUrl || r.imageUrl;
    }
    if (imageUrl && videoUrl) {
      break;
    }
  }

  return { imageUrl, videoUrl };
}

export function resolveCommunityPostMedia(
  communityPost: Pick<CommunityPost, 'data' | 'structureType' | 'dataType'> & { files?: unknown[] },
  files?: CommunityFile[],
): ResolvedPostMedia {
  const data = communityPost.data;
  const dataObj = data && typeof data === 'object' ? (data as Record<string, unknown>) : undefined;

  const typeHints = [communityPost.structureType, communityPost.dataType, dataObj?.type].filter(
    (v): v is string => typeof v === 'string',
  );
  const hintsVideo = typeHints.some((s) => s.toLowerCase() === 'video');

  const fileRows = mergeFeedFileSources(files, communityPost);

  let videoUrl: string | undefined;
  let imageUrl: string | undefined;

  const fileUrlDirect =
    dataObj && typeof dataObj.fileUrl === 'string' && dataObj.fileUrl.trim() ? dataObj.fileUrl.trim() : undefined;
  if (fileUrlDirect) {
    const looksVideoPath = /\.(mp4|webm|mov|m3u8)(\?|$)/i.test(fileUrlDirect);
    if (hintsVideo || looksVideoPath) {
      videoUrl = fileUrlDirect;
    } else {
      imageUrl = fileUrlDirect;
    }
  }

  const dataVideoUrlRaw = dataObj?.videoUrl;
  if (dataVideoUrlRaw && typeof dataVideoUrlRaw === 'object' && !Array.isArray(dataVideoUrlRaw)) {
    const u = pickHttpUrlFromVideoUrlObject(dataVideoUrlRaw as Record<string, unknown>);
    if (u) {
      videoUrl = videoUrl || u;
    }
  }

  if (dataObj) {
    const fromImageKey = nestedImageFileUrl(dataObj.image);
    if (fromImageKey) {
      imageUrl = imageUrl || fromImageKey;
    }
    const fileVal = dataObj.file;
    if (fileVal && typeof fileVal === 'object' && !Array.isArray(fileVal)) {
      const row = fileVal as FeedFileRow;
      const u = nestedImageFileUrl(row);
      if (u) {
        if (isVideoRow(row) || hintsVideo) {
          videoUrl = videoUrl || u;
        } else {
          imageUrl = imageUrl || u;
        }
      }
    }
  }

  if (dataObj && !videoUrl) {
    const directImg = extractDirectImageUrl(dataObj);
    if (directImg) {
      imageUrl = imageUrl || directImg;
    }
  }

  const videoIds = dataObj ? parseVideoFileIdField(dataObj.videoFileId) : undefined;
  if (videoIds) {
    videoUrl = videoUrl || resolveVideoUrlFromIdMap(videoIds, fileRows);
    if (!imageUrl) {
      const vidBase = videoIds.original ?? videoIds.high ?? videoIds.medium ?? videoIds.low ?? undefined;
      if (typeof vidBase === 'string' && vidBase.trim()) {
        imageUrl = findThumbnailUrlForVideoBaseId(vidBase.trim(), fileRows);
      }
    }
  }

  const thumbnailFileId =
    dataObj && typeof dataObj.thumbnailFileId === 'string' ? dataObj.thumbnailFileId.trim() : undefined;
  const clipThumbnailId = dataObj && typeof dataObj.thumbnailId === 'string' ? dataObj.thumbnailId.trim() : undefined;
  const thumbFromField = lookupUrlByFileId(thumbnailFileId, fileRows) || lookupUrlByFileId(clipThumbnailId, fileRows);

  const mainFileId = extractFileIdFromField(dataObj?.fileId) ?? extractFileIdFromField(dataObj?.file) ?? undefined;

  const mainRow = mainFileId
    ? fileRows.find((r) => {
        const candidates = [r.fileId, r._id, r.id].filter((x): x is string => typeof x === 'string');
        return candidates.some((x) => x.trim() === mainFileId);
      })
    : undefined;

  if (mainFileId && fileRows.length > 0) {
    const mainUrl = rowUrl(mainRow) ?? lookupUrlByFileId(mainFileId, fileRows);
    if (mainRow && isVideoRow(mainRow)) {
      videoUrl = videoUrl || pickVideoPlaybackUrlFromFileRow(mainRow) || mainUrl;
      imageUrl = imageUrl || thumbFromField || findThumbnailUrlForVideoBaseId(mainFileId, fileRows) || undefined;
    } else if (mainUrl && !videoUrl) {
      imageUrl = imageUrl || mainUrl;
    }
  }

  if (!videoUrl && hintsVideo && mainRow && isVideoRow(mainRow)) {
    videoUrl = pickVideoPlaybackUrlFromFileRow(mainRow) || rowUrl(mainRow);
    imageUrl =
      imageUrl ||
      thumbFromField ||
      (mainFileId ? findThumbnailUrlForVideoBaseId(mainFileId, fileRows) : undefined) ||
      undefined;
  }

  if (videoUrl) {
    imageUrl =
      imageUrl ||
      thumbFromField ||
      (mainFileId ? findThumbnailUrlForVideoBaseId(mainFileId, fileRows) : undefined) ||
      undefined;
  }

  return { imageUrl, videoUrl };
}
