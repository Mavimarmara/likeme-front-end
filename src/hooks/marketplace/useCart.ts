import { useState, useCallback, useMemo } from 'react';
import storageService from '@/services/auth/storageService';
import productService from '@/services/product/productService';
import type { CartItem } from '@/types/cart';
import { logger } from '@/utils/logger';

export type UseCartOptions = {
  /** Chamado quando o carrinho fica vazio após remover item (ex.: navegar para Cart) */
  onEmpty?: () => void;
};

export type UseCartReturn = {
  cartItems: CartItem[];
  loading: boolean;
  /** Carrega itens do storage (sem validar estoque) */
  loadCartItems: () => Promise<void>;
  /** Carrega e valida itens (estoque, produto existe). Chama onRemoved com títulos dos removidos. */
  loadAndValidateCartItems: (onRemoved?: (removedNames: string[]) => void) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  subtotal: number;
};

export function useCart(options: UseCartOptions = {}): UseCartReturn {
  const { onEmpty } = options;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await storageService.getCartItems();
      setCartItems(items);
    } catch (error) {
      logger.error('[useCart] Erro ao carregar itens do carrinho', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAndValidateCartItems = useCallback(async (onRemoved?: (removedNames: string[]) => void) => {
    try {
      setLoading(true);
      const items = await storageService.getCartItems();
      const validatedItems: CartItem[] = [];
      const removedItems: string[] = [];

      for (const item of items) {
        try {
          const productResponse = await productService.getProductById(item.id);

          if (!productResponse.success || !productResponse.data) {
            removedItems.push(item.title || item.id);
            continue;
          }

          const product = productResponse.data;
          const requestedQuantity = Number(item.quantity) || 1;

          if (product.quantity !== null) {
            const availableQuantity = product.quantity;
            if (availableQuantity < requestedQuantity) {
              if (availableQuantity === 0) {
                removedItems.push(item.title || item.id);
                continue;
              }
              (item as CartItem).quantity = availableQuantity;
            }
          }

          validatedItems.push({
            ...item,
            price: Number(product.price) || Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            rating: Number(item.rating) || 0,
          } as CartItem);
        } catch {
          removedItems.push(item.title || item.id);
        }
      }

      if (validatedItems.length !== items.length || removedItems.length > 0) {
        await storageService.setCartItems(validatedItems);
        onRemoved?.(removedItems);
      }

      setCartItems(validatedItems);
    } catch (error) {
      logger.error('[useCart] Erro ao carregar/validar itens do carrinho', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const increaseQuantity = useCallback(async (id: string) => {
    const items = await storageService.getCartItems();
    const updated = items.map((item: CartItem) =>
      item.id === id ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item,
    );
    await storageService.setCartItems(updated);
    setCartItems(updated);
  }, []);

  const decreaseQuantity = useCallback(
    async (id: string) => {
      const items = await storageService.getCartItems();
      const current = items.find((i: CartItem) => i.id === id);
      if (!current) return;
      const q = Number(current.quantity) || 1;
      if (q <= 1) {
        await storageService.removeCartItem(id);
        const next = await storageService.getCartItems();
        setCartItems(next);
        if (next.length === 0) onEmpty?.();
        return;
      }
      const updated = items.map((item: CartItem) => (item.id === id ? { ...item, quantity: q - 1 } : item));
      await storageService.setCartItems(updated);
      setCartItems(updated);
    },
    [onEmpty],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await storageService.removeCartItem(id);
      const items = await storageService.getCartItems();
      setCartItems(items);
      if (items.length === 0) onEmpty?.();
    },
    [onEmpty],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return sum + price * quantity;
      }, 0),
    [cartItems],
  );

  return {
    cartItems,
    loading,
    loadCartItems,
    loadAndValidateCartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    subtotal,
  };
}
