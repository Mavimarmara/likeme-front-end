export function normalizeProductListBadgeLabels(tags: string[], translate: (key: string) => string): string[] {
  return tags
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter(Boolean)
    .map((tag) => {
      if (tag === 'online' || tag === 'onsite') {
        return translate(`marketplace.productMode.${tag}`);
      }
      return tag;
    });
}
