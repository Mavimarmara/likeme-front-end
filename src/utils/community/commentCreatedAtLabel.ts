const MINUTE_MS = 60 * 1000;

const PT_SHORT_MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;

function normalizeLocale(locale: string | undefined): string {
  if (!locale || typeof locale !== 'string') return 'pt-BR';
  return locale.trim().replace(/_/g, '-');
}

export function parseCommentCreatedAt(value: string | number | Date | undefined | null): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const trimmed = String(value).trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    const ms = numeric < 1e12 ? numeric * 1000 : numeric;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDayShortMonth(date: Date, locale: string): string {
  const day = date.getDate();
  const normalized = normalizeLocale(locale).toLowerCase();

  if (normalized.startsWith('pt')) {
    return `${day} ${PT_SHORT_MONTHS[date.getMonth()]}`;
  }

  try {
    const formatted = date.toLocaleDateString(normalized, { day: 'numeric', month: 'short' });
    const label = formatted
      .replace(/\s+de\s+/gi, ' ')
      .replace(/\./g, '')
      .trim();
    if (label) return label;
  } catch {
    // fallback abaixo
  }

  return `${day} ${PT_SHORT_MONTHS[date.getMonth()]}`;
}

export function commentCreatedAtLabel(iso: string, locale = 'pt-BR'): string {
  const created = parseCommentCreatedAt(iso);
  if (!created) return '';

  const diffMs = Date.now() - created.getTime();

  if (diffMs < 0) {
    return formatDayShortMonth(created, locale);
  }

  const totalMinutes = Math.floor(diffMs / MINUTE_MS);
  if (totalMinutes < 60) return `${Math.max(totalMinutes, 1)} min`;

  const totalHours = Math.floor(totalMinutes / 60);
  if (totalHours < 24) return `${Math.max(totalHours, 1)}h`;

  return formatDayShortMonth(created, locale);
}
