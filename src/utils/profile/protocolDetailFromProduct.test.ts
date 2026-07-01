import type { Product } from '@/types/product';
import { protocolDetailFromProduct } from '@/utils/profile/protocolDetailFromProduct';

describe('protocolDetailFromProduct', () => {
  it('mapeia produto program para modelo de ProtocolDetail', () => {
    const product: Product = {
      id: 'product-1',
      name: 'Protocolo X',
      description: 'Descrição',
      technicalSpecifications: 'Acordos',
      image: 'https://example.com/image.jpg',
      categoryNames: ['Saúde'],
      programCommunity: {
        socialPlusCommunityId: 'community-1',
      },
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    expect(protocolDetailFromProduct(product)).toEqual({
      id: 'product-1',
      productId: 'product-1',
      name: 'Protocolo X',
      image: 'https://example.com/image.jpg',
      description: 'Descrição',
      agreements: 'Acordos',
      communityId: 'community-1',
      badges: ['Saúde'],
    });
  });
});
