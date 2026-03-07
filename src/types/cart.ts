import type { Product } from '@/types/product';

/**
 * Tipo do produto (amazon product, physical product, program) - alinhado a Product.type
 */
export type ProductType = Product['type'];

/**
 * Categoria de exibição do item (derivada de type para compatibilidade de UI).
 * Programs = program, Product = physical product / amazon product.
 */
export type CartItemCategory = 'Programs' | 'Product' | 'Service' | 'Sport';

/**
 * Item do carrinho: dados do produto (type, categoryId) + quantidade e campos de exibição.
 * Alinhado ao tipo Product para categories e type.
 */
export interface CartItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  price: number;
  quantity: number;
  rating?: number;
  /** Tipo do produto (Product.type): amazon product, physical product, program */
  type?: ProductType;
  /** Categoria de domínio (Product.categoryId), ex.: Estresse, Sono */
  categoryId?: string;
  /** Categoria de exibição derivada de type (Programs, Product, etc.) */
  category?: CartItemCategory;
  /** Tags para badges na UI, derivadas de type (e opcionalmente category) */
  tags: string[];
  /** Data opcional (ex.: entrega, evento) */
  date?: string;
  /** Previsão de entrega (ex.: tela de pedido) */
  deliveryForecast?: string;
}
