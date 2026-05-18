import type { PublicUser } from '@/types/user/publicUser';

/**
 * Cache singleton de PublicUser por id. Compartilhado entre todas as instancias
 * de `useUser()` para evitar requisições duplicadas quando varios componentes
 * (PostCard, CommentCard, etc.) pedem o mesmo autor.
 */
const cache = new Map<string, PublicUser>();
const inflight = new Map<string, Promise<PublicUser>>();

export function getCachedPublicUser(userId: string): PublicUser | undefined {
  return cache.get(userId);
}

export function setCachedPublicUser(userId: string, user: PublicUser): void {
  cache.set(userId, user);
}

export function getInflightPublicUser(userId: string): Promise<PublicUser> | undefined {
  return inflight.get(userId);
}

export function setInflightPublicUser(userId: string, promise: Promise<PublicUser>): void {
  inflight.set(userId, promise);
}

export function deleteInflightPublicUser(userId: string): void {
  inflight.delete(userId);
}

/** Limpa o cache compartilhado de usuarios publicos (use ao trocar de conta). */
export function clearPublicUserCache(): void {
  cache.clear();
  inflight.clear();
}
