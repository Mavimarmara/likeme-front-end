export function normalizeSemanticVersionString(raw: string): string {
  const trimmed = raw.trim().replace(/^v/i, '');
  const head = trimmed.split(/[^0-9.]/)[0] ?? '';
  const parts = head.split('.').filter((p) => p.length > 0);
  if (parts.length === 0) {
    return '0.0.0';
  }
  while (parts.length < 3) {
    parts.push('0');
  }
  return parts.slice(0, 3).join('.');
}

export function compareSemanticVersions(a: string, b: string): number {
  const pa = normalizeSemanticVersionString(a)
    .split('.')
    .map((p) => parseInt(p, 10) || 0);
  const pb = normalizeSemanticVersionString(b)
    .split('.')
    .map((p) => parseInt(p, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da < db) {
      return -1;
    }
    if (da > db) {
      return 1;
    }
  }
  return 0;
}
