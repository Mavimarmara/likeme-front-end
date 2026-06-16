import type { Ad } from '@/types/ad';

export function uniqueAdsById(ads: readonly Ad[]): Ad[] {
  const seen = new Set<string>();
  const result: Ad[] = [];

  for (const ad of ads) {
    if (seen.has(ad.id)) {
      continue;
    }
    seen.add(ad.id);
    result.push(ad);
  }

  return result;
}

export function appendUniqueAdsById(existing: readonly Ad[], incoming: readonly Ad[]): Ad[] {
  if (incoming.length === 0) {
    return [...existing];
  }

  const seen = new Set(existing.map((ad) => ad.id));
  const merged = [...existing];

  for (const ad of incoming) {
    if (seen.has(ad.id)) {
      continue;
    }
    seen.add(ad.id);
    merged.push(ad);
  }

  return merged;
}
