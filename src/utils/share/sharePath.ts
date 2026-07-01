export function sharePathFromUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('://')) {
    try {
      const parsed = new URL(trimmed);
      const scheme = parsed.protocol.replace(':', '');
      if (scheme !== 'http' && scheme !== 'https') {
        return null;
      }
      return parsed.pathname;
    } catch {
      return null;
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function shareEntityIdFromPath(path: string, pathPrefix: string): string | null {
  const normalizedPrefix = `${pathPrefix.replace(/^\/+/, '')}/`;
  const normalized = path.replace(/^\/+/, '');
  if (!normalized.startsWith(normalizedPrefix)) {
    return null;
  }

  const entityId = normalized.slice(normalizedPrefix.length).split('/')[0]?.trim();
  return entityId ? decodeURIComponent(entityId) : null;
}
