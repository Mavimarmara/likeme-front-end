import type { Product } from '@/types/product';
import type { ProtocolDetailProtocol } from '@/types/navigation';

export function protocolDetailFromProduct(product: Product): ProtocolDetailProtocol {
  const productId = product.id.trim();

  return {
    id: productId,
    productId,
    name: product.name,
    image: product.image,
    description: product.description,
    agreements: product.technicalSpecifications,
    communityId: product.programCommunity?.socialPlusCommunityId?.trim() || undefined,
    badges: product.categoryNames?.filter(Boolean) ?? [],
  };
}
