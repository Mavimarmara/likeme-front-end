export type LinkifiedSegment =
  | { kind: 'text'; text: string }
  | { kind: 'url'; text: string; href: string }
  | { kind: 'phone'; text: string; telHref: string };

type Range = { start: number; end: number };

const URL_RE = /\b(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

const PHONE_CANDIDATE_RE = /\(?\+?\d(?:[\d\s().-]*\d){8,14}/g;

function trimUrlDisplay(raw: string): string {
  return raw.replace(/[.,;:!?)\]}>'"]+$/u, '');
}

function normalizeUrlHref(display: string): string {
  if (/^www\./i.test(display)) {
    return `https://${display}`;
  }
  return display;
}

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

function looksLikePhone(raw: string): boolean {
  const d = digitsOnly(raw);
  if (d.length < 10 || d.length > 15) return false;
  if (raw.trim().startsWith('+')) return true;
  if (/[^\d+]/.test(raw)) return true;
  return d.length >= 11;
}

function normalizeTelHref(raw: string): string {
  const d = digitsOnly(raw);
  if (d.length < 8) return '';
  return `tel:${d}`;
}

function overlaps(a: Range, b: Range): boolean {
  return a.start < b.end && b.start < a.end;
}

function collectUrlHits(input: string): Array<Range & { kind: 'url'; surface: string; href: string }> {
  const out: Array<Range & { kind: 'url'; surface: string; href: string }> = [];
  for (const m of input.matchAll(URL_RE)) {
    const raw = m[0];
    const start = m.index ?? 0;
    const surface = trimUrlDisplay(raw);
    if (!surface) continue;
    out.push({
      start,
      end: start + raw.length,
      kind: 'url',
      surface,
      href: normalizeUrlHref(surface),
    });
  }
  return out;
}

function collectPhoneHits(
  input: string,
  blocked: Range[],
): Array<Range & { kind: 'phone'; surface: string; telHref: string }> {
  const out: Array<Range & { kind: 'phone'; surface: string; telHref: string }> = [];
  for (const m of input.matchAll(PHONE_CANDIDATE_RE)) {
    const raw = m[0];
    const start = m.index ?? 0;
    const end = start + raw.length;
    const range: Range = { start, end };
    if (blocked.some((b) => overlaps(b, range))) continue;
    if (!looksLikePhone(raw)) continue;
    const telHref = normalizeTelHref(raw);
    if (!telHref) continue;
    out.push({
      start,
      end,
      kind: 'phone',
      surface: raw,
      telHref,
    });
  }
  return out;
}

function mergeNonOverlappingHits<T extends Range>(hits: T[]): T[] {
  const sorted = [...hits].sort((a, b) => a.start - b.start || b.end - a.end);
  const out: T[] = [];
  let cursor = -1;
  for (const h of sorted) {
    if (h.start < cursor) continue;
    out.push(h);
    cursor = h.end;
  }
  return out.sort((a, b) => a.start - b.start);
}

export function parseLinkifiedPlainText(input: string): LinkifiedSegment[] {
  if (!input) return [];

  const urlHits = collectUrlHits(input);
  const urlRanges = urlHits.map(({ start, end }) => ({ start, end }));
  const phoneHits = collectPhoneHits(input, urlRanges);
  const merged = mergeNonOverlappingHits([...urlHits, ...phoneHits]);

  const segments: LinkifiedSegment[] = [];
  let index = 0;
  for (const hit of merged) {
    if (hit.start > index) {
      segments.push({ kind: 'text', text: input.slice(index, hit.start) });
    }
    if (hit.kind === 'url') {
      segments.push({ kind: 'url', text: hit.surface, href: hit.href });
    } else {
      segments.push({ kind: 'phone', text: hit.surface, telHref: hit.telHref });
    }
    index = hit.end;
  }
  if (index < input.length) {
    segments.push({ kind: 'text', text: input.slice(index) });
  }

  return segments.length > 0 ? segments : [{ kind: 'text', text: input }];
}
