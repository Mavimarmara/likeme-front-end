import type { ApiResponse } from '@/types/infrastructure';
import type { ProductCatalogType } from './productCatalogType';

export { PRODUCT_CATALOG_TYPE, PRODUCT_CATALOG_TYPE_VALUES, type ProductCatalogType } from './productCatalogType';

export interface Advertiser {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ad {
  id: string;
  advertiserId?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'expired';
  targetAudience?: string;
  createdAt: string;
  updatedAt: string;
  advertiser?: Advertiser;
  product?: Product; // Product contains: name, description, image, externalUrl, type, categoryId
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  variation?: string; // Product variation (size, color, flavor, volume, etc)
  targetAudience?: string; // Who is this product for
  technicalSpecifications?: string; // Technical specs and composition
  sku?: string;
  price?: number; // Optional when externalUrl is provided
  cost?: number;
  quantity?: number; // Optional when externalUrl is provided
  image?: string;
  type?: ProductCatalogType | string;
  categoryId?: string; // FK to Category (Estresse, Sono, etc.)
  brand?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  weight?: number;
  dimensions?: string;
  externalUrl?: string; // External URL for the product (e.g., Amazon product link)
  createdAt: string;
  updatedAt: string;
  advertiserId?: string; // Dono do anúncio / parceiro
  ads?: Ad[];
}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  type?: ProductCatalogType | string;
  categoryId?: string; // domain category (Estresse, Sono, etc.)
  status?: string;
  search?: string;
}

export type ListProductsApiResponse = ApiResponse<{
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export type GetProductApiResponse = ApiResponse<Product>;

export interface CreateProductData {
  name: string;
  description?: string;
  variation?: string;
  targetAudience?: string;
  technicalSpecifications?: string;
  sku?: string;
  price?: number; // Optional when externalUrl is provided
  cost?: number;
  quantity?: number; // Optional when externalUrl is provided
  image?: string;
  type?: ProductCatalogType | string;
  categoryId?: string;
  brand?: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  weight?: number;
  dimensions?: string;
  externalUrl?: string; // External URL for the product (e.g., Amazon product link)
}

export type UpdateProductData = Partial<CreateProductData>;

export interface UpdateStockData {
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}
