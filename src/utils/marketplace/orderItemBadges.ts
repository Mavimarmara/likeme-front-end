import type { Product } from '@/types/product';
import { catalogTypeTranslatedBadgeLabels } from '@/types/product';

export function orderItemBadgeLabels(product: Product | undefined, translate: (key: string) => string): string[] {
  const labels = catalogTypeTranslatedBadgeLabels(product?.type, translate);
  const categoryName = product?.categoryNames?.[0] ?? product?.categoryName;
  if (categoryName?.trim()) {
    labels.push(categoryName.trim());
  }
  return labels;
}
