/**
 * Testes unitários para cartMapper
 *
 * Documenta como produtos são mapeados para itens do carrinho,
 * incluindo normalização de preços e valores padrão.
 */

import { mapProductToCartItem } from './cartMapper';
import type { Product as ApiProduct } from '@/types/product';

describe('cartMapper', () => {
  const mockApiProduct: ApiProduct = {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test description',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    type: 'physical product',
    quantity: 10,
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  describe('mapProductToCartItem', () => {
    it('deve mapear produto para item do carrinho corretamente', () => {
      const result = mapProductToCartItem(mockApiProduct);

      expect(result).toEqual({
        id: 'product-1',
        image: 'https://example.com/image.jpg',
        title: 'Test Product',
        subtitle: 'Test description',
        price: 29.99,
        quantity: 1,
        rating: 5,
        type: 'physical product',
        categoryId: undefined,
        category: 'Product',
        tags: ['physical product'],
      });
    });

    it('deve normalizar preço numérico corretamente', () => {
      const result = mapProductToCartItem(mockApiProduct);
      expect(result.price).toBe(29.99);
    });

    it('deve normalizar preço string para número', () => {
      const productWithStringPrice = {
        ...mockApiProduct,
        price: '29.99' as any,
      };
      const result = mapProductToCartItem(productWithStringPrice);
      expect(result.price).toBe(29.99);
    });

    it('deve remover caracteres não numéricos do preço string', () => {
      const productWithFormattedPrice = {
        ...mockApiProduct,
        price: '$29.99' as any,
      };
      const result = mapProductToCartItem(productWithFormattedPrice);
      expect(result.price).toBe(29.99);
    });

    it('deve retornar 0 para preço inválido', () => {
      const productWithInvalidPrice = {
        ...mockApiProduct,
        price: 'invalid' as any,
      };
      const result = mapProductToCartItem(productWithInvalidPrice);
      expect(result.price).toBe(0);
    });

    it('deve usar placeholder quando image é undefined', () => {
      const productWithoutImage = { ...mockApiProduct, image: undefined };
      const result = mapProductToCartItem(productWithoutImage);

      expect(result.image).toBe('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400');
    });

    it('deve usar array vazio para tags quando type é undefined', () => {
      const productWithoutType = {
        ...mockApiProduct,
        type: undefined,
      };
      const result = mapProductToCartItem(productWithoutType);

      expect(result.tags).toEqual([]);
      expect(result.category).toBe('Product');
    });

    it('deve usar "Product" como category padrão quando type não é program', () => {
      const result = mapProductToCartItem(mockApiProduct);
      expect(result.category).toBe('Product');
    });

    it('deve usar category "Programs" quando type é program', () => {
      const programProduct = { ...mockApiProduct, type: 'program' as const };
      const result = mapProductToCartItem(programProduct);
      expect(result.category).toBe('Programs');
    });

    it('deve usar description vazia quando undefined', () => {
      const productWithoutDescription = {
        ...mockApiProduct,
        description: undefined,
      };
      const result = mapProductToCartItem(productWithoutDescription);

      expect(result.subtitle).toBe('');
    });

    it('deve sempre definir quantity como 1', () => {
      const result = mapProductToCartItem(mockApiProduct);
      expect(result.quantity).toBe(1);
    });

    it('deve sempre definir rating como 5', () => {
      const result = mapProductToCartItem(mockApiProduct);
      expect(result.rating).toBe(5);
    });
  });
});
