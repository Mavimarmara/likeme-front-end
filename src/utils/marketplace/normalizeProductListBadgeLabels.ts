function productModeTranslationKeyFromTag(tag: string): 'online' | 'onsite' | null {
  const normalized = tag.trim().toLowerCase();
  if (normalized === 'online' || normalized === 'onsite') {
    return normalized;
  }
  return null;
}

export function normalizeProductListBadgeLabels(tags: string[], translate: (key: string) => string): string[] {
  return tags
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter(Boolean)
    .map((tag) => {
      const modeKey = productModeTranslationKeyFromTag(tag);
      if (modeKey) {
        return translate(`marketplace.productMode.${modeKey}`);
      }
      return tag;
    });
}
