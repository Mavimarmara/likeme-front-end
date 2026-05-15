/** Embaralha cópia da lista (Fisher–Yates). */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = copy[i];
    copy[i] = copy[j];
    copy[j] = current;
  }
  return copy;
}

export function pickRandomItems<T>(items: readonly T[], count: number): T[] {
  if (count <= 0 || items.length === 0) {
    return [];
  }
  return shuffleArray(items).slice(0, Math.min(count, items.length));
}
