import type { StoredUser } from '@/types/auth';
import { personNameLabel, uniqueNameFromParts } from '@/utils/user/personNameLabel';

function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function resolveCommentAuthorDisplayName(
  user: Record<string, unknown> | undefined | null,
  fallbackUserId: string,
): string {
  if (user && typeof user === 'object') {
    const first = trimString(user.firstName ?? user.givenName ?? user.given_name);
    const last = trimString(user.lastName ?? user.familyName ?? user.family_name ?? user.surname);
    const combined = uniqueNameFromParts(first, last);
    if (combined.length > 0) {
      return combined;
    }
    const display = trimString(user.displayName);
    if (display.length > 0) {
      return display;
    }
  }
  if (fallbackUserId) {
    return `User ${String(fallbackUserId).slice(0, 8)}`;
  }
  return 'Usuário';
}

export function resolveOptimisticCommentAuthorLabel(stored: StoredUser | null): string {
  if (!stored) {
    return 'Você';
  }
  const full = trimString(stored.name);
  if (full.length > 0) {
    return personNameLabel(full);
  }
  const nick = trimString(stored.nickname);
  if (nick.length > 0) {
    return nick;
  }
  return 'Você';
}
