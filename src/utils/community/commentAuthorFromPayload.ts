import { resolveCommentAuthorDisplayName } from '@/utils/community/commentAuthorDisplayName';
import { personNameLabel } from '@/utils/user/personNameLabel';

type CommunityPayloadRecord = Record<string, unknown>;

type CommunityFileRecord = {
  fileId?: string;
  fileUrl?: string;
};

export function commentAuthorIds(remoteComment: CommunityPayloadRecord): string[] {
  const candidates = [remoteComment.userId, remoteComment.userPublicId, remoteComment.userInternalId];
  const seen = new Set<string>();
  const ids: string[] = [];

  for (const value of candidates) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    ids.push(trimmed);
  }

  return ids;
}

export function communityUserMatchingComment(
  remoteComment: CommunityPayloadRecord,
  users: CommunityPayloadRecord[],
): CommunityPayloadRecord | undefined {
  const commentIds = new Set(commentAuthorIds(remoteComment));
  if (commentIds.size === 0) return undefined;

  return users.find((user) => commentAuthorIds(user).some((id) => commentIds.has(id)));
}

export function communityUserAvatarUrl(
  user: CommunityPayloadRecord | undefined,
  files: CommunityFileRecord[],
): string | undefined {
  const customUrl = typeof user?.avatarCustomUrl === 'string' ? user.avatarCustomUrl.trim() : '';
  if (customUrl) return customUrl;

  const avatarFileId = typeof user?.avatarFileId === 'string' ? user.avatarFileId.trim() : '';
  if (!avatarFileId) return undefined;

  const file = files.find((item) => item.fileId === avatarFileId);
  const fileUrl = file?.fileUrl?.trim();
  return fileUrl || undefined;
}

export function commentAuthorLabelFromPayload(
  remoteComment: CommunityPayloadRecord,
  users: CommunityPayloadRecord[],
  fallbackUserId: string,
): string {
  const bundledUser = communityUserMatchingComment(remoteComment, users);
  if (!bundledUser) {
    return 'Usuário';
  }

  return personNameLabel(resolveCommentAuthorDisplayName(bundledUser, fallbackUserId));
}
