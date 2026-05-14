import type { CommunityCategory } from '@/types/community';
import type { Product } from '@/types/product';

const MAX_CATEGORY_BADGES = 2;

type ProductCategorySource = Pick<Product, 'categoryId' | 'categoryIds' | 'categoryNames'>;

export function buildMarketplaceCategoryBadgeLabels(
  product: ProductCategorySource | undefined,
  categories: CommunityCategory[],
): string[] {
  if (!product) {
    return [];
  }

  const fromApi = (product.categoryNames ?? []).map((n) => (typeof n === 'string' ? n.trim() : '')).filter(Boolean);
  if (fromApi.length > 0) {
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const label of fromApi) {
      if (seen.has(label)) continue;
      seen.add(label);
      unique.push(label);
      if (unique.length >= MAX_CATEGORY_BADGES) break;
    }
    return unique;
  }

  const orderedIds: string[] = [];
  const pushId = (raw: string | undefined) => {
    if (raw == null || typeof raw !== 'string') return;
    const id = raw.trim();
    if (!id || orderedIds.includes(id)) return;
    orderedIds.push(id);
  };

  pushId(product.categoryId);
  for (const raw of product.categoryIds ?? []) {
    pushId(typeof raw === 'string' ? raw : String(raw));
  }

  const labels: string[] = [];
  const seenLabels = new Set<string>();
  for (const id of orderedIds) {
    const name = categories.find((c) => String(c.categoryId) === String(id))?.name?.trim();
    if (!name || seenLabels.has(name)) continue;
    seenLabels.add(name);
    labels.push(name);
    if (labels.length >= MAX_CATEGORY_BADGES) break;
  }

  return labels;
}
