import type { StoredUser } from '@/types/auth';

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
    const combined = [first, last]
      .filter((p) => p.length > 0)
      .join(' ')
      .trim();
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
    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]} ${parts.slice(1).join(' ')}`;
    }
    return full;
  }
  const nick = trimString(stored.nickname);
  if (nick.length > 0) {
    return nick;
  }
  return 'Você';
}
