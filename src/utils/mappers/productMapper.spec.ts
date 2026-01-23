/**
 * Testes unitários para productMapper
 *
 * Documenta como produtos são mapeados entre diferentes formatos
 * usados no sistema (API, Carousel, Navigation).
 */

import { mapApiProductToCarouselProduct, mapApiProductToNavigationParams } from './productMapper';
import type { Product as ApiProduct } from '@/types/product';
import type { Product } from '@/components/sections/product';

jest.mock('@/utils/formatters', () => ({
  formatPrice: jest.fn((price) => {
    if (price === null || price === undefined || isNaN(Number(price))) {
      return '$0.00';
    }
    return `$${Number(price).toFixed(2)}`;
  }),
}));

describe('productMapper', () => {
  const mockApiProduct: ApiProduct = {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test description',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    category: 'physical product',
    quantity: 10,
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  describe('mapApiProductToCarouselProduct', () => {
    it('deve mapear produto da API para formato do carousel', () => {
      const result = mapApiProductToCarouselProduct(mockApiProduct);

      expect(result).toEqual({
        id: 'product-1',
        title: 'Test Product',
        price: 29.99,
        tag: 'physical product',
        image: 'https://example.com/image.jpg',
        likes: 0,
      });
    });

    it('deve usar "Product" como tag padrão quando category é undefined', () => {
      const productWithoutCategory = { ...mockApiProduct, category: undefined };
      const result = mapApiProductToCarouselProduct(productWithoutCategory);

      expect(result.tag).toBe('Product');
    });

    it('deve usar placeholder quando image é undefined', () => {
      const productWithoutImage = { ...mockApiProduct, image: undefined };
      const result = mapApiProductToCarouselProduct(productWithoutImage);

      expect(result.image).toBe('https://via.placeholder.com/400');
    });

    it('deve converter price null/undefined para 0', () => {
      const productWithNullPrice = { ...mockApiProduct, price: null };
      const result = mapApiProductToCarouselProduct(productWithNullPrice);

      // O mapper converte null/undefined para 0 usando || 0
      expect(result.price).toBe(0);
    });
  });

  describe('mapApiProductToNavigationParams', () => {
    it('deve mapear produto da API para parâmetros de navegação', () => {
      const result = mapApiProductToNavigationParams(mockApiProduct);

      expect(result).toEqual({
        id: 'product-1',
        title: 'Test Product',
        price: '$29.99',
        image: 'https://example.com/image.jpg',
        category: 'physical product',
        description: 'Test description',
      });
    });

    it('deve formatar preço corretamente', () => {
      const result = mapApiProductToNavigationParams(mockApiProduct);
      expect(result.price).toMatch(/^\$\d+\.\d{2}$/);
    });

    it('deve usar placeholder quando image é undefined', () => {
      const productWithoutImage = { ...mockApiProduct, image: undefined };
      const result = mapApiProductToNavigationParams(productWithoutImage);

      expect(result.image).toBe('https://via.placeholder.com/400');
    });

    it('deve lidar com price null/undefined', () => {
      const productWithNullPrice = { ...mockApiProduct, price: null };
      const result = mapApiProductToNavigationParams(productWithNullPrice);

      expect(result.price).toBe('$0.00');
    });
  });
});
