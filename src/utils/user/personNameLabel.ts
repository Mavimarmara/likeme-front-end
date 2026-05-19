function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function uniqueNameTokens(...partValues: string[]): string[] {
  const tokens: string[] = [];
  for (const part of partValues) {
    const trimmed = trimString(part);
    if (!trimmed) continue;
    for (const word of trimmed.split(/\s+/)) {
      if (!word) continue;
      const lower = word.toLowerCase();
      if (tokens.some((token) => token.toLowerCase() === lower)) continue;
      tokens.push(word);
    }
  }
  return tokens;
}

export function uniqueNameFromParts(...parts: string[]): string {
  return uniqueNameTokens(...parts).join(' ');
}

export function personNameLabel(raw: string): string {
  const deduped = uniqueNameFromParts(raw);
  if (!deduped) return 'Usuário';

  return deduped
    .split(/\s+/)
    .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ');
}
