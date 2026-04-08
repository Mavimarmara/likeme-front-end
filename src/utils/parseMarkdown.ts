export type MarkdownSegment = {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

/**
 * Subconjunto usado em labels i18n do banco:
 * - `**negrito**`
 * - `*itálico*` (um `*`; `**` é tratado antes)
 * - `__sublinhado__`
 * - `\n` permanece no texto dos segmentos
 */
export function parseMarkdownSegments(input: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  let i = 0;
  let bold = false;
  let italic = false;
  let underline = false;
  let buffer = '';

  const flush = () => {
    if (buffer.length === 0) return;
    segments.push({ text: buffer, bold, italic, underline });
    buffer = '';
  };

  while (i < input.length) {
    const c = input[i];
    const next = input[i + 1];

    if (c === '*' && next === '*') {
      flush();
      bold = !bold;
      i += 2;
      continue;
    }
    if (c === '*') {
      flush();
      italic = !italic;
      i += 1;
      continue;
    }
    if (c === '_' && next === '_') {
      flush();
      underline = !underline;
      i += 2;
      continue;
    }

    buffer += c;
    i += 1;
  }

  flush();

  const merged: MarkdownSegment[] = [];
  for (const seg of segments) {
    const prev = merged[merged.length - 1];
    if (prev && prev.bold === seg.bold && prev.italic === seg.italic && prev.underline === seg.underline) {
      merged[merged.length - 1] = { ...prev, text: prev.text + seg.text };
    } else {
      merged.push(seg);
    }
  }

  return merged;
}

/** Texto exibível sem delimitadores de markdown (para `t()`, Alert, a11y, etc.). */
export function markdownToPlainText(input: string): string {
  return parseMarkdownSegments(input)
    .map((s) => s.text)
    .join('');
}
