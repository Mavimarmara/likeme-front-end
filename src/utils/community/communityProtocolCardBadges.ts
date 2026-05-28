import type { Community, CommunityCategory } from '@/types/community';
import { COMMUNITY_PROTOCOL_TAG } from '@/constants/community/communityProtocol';

function normalized(value: string): string {
  return value.trim().toLowerCase();
}

export function communityProtocolCardBadges(community: Community, categories: CommunityCategory[]): string[] {
  const categoryById = new Map(
    categories
      .map((category) => [String(category.categoryId).trim(), category.name.trim()] as const)
      .filter(([id, name]) => id.length > 0 && name.length > 0),
  );

  const badges: string[] = [];

  if (Array.isArray(community.tags)) {
    for (const tag of community.tags) {
      const label = String(tag).trim();
      if (label) {
        badges.push(label);
      }
    }
  }

  const categoryIds = community.categoryIds;
  if (Array.isArray(categoryIds)) {
    for (const categoryId of categoryIds) {
      const name = categoryById.get(String(categoryId).trim());
      if (name) {
        badges.push(name);
      }
    }
  }

  const unique = [...new Set(badges.map((badge) => badge.trim()).filter(Boolean))];
  if (unique.length > 0) {
    return unique.slice(0, 2);
  }

  return [COMMUNITY_PROTOCOL_TAG];
}
