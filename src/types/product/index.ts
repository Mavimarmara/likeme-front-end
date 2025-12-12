import type { ApiResponse } from '@/types/infrastructure';

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  cost?: number;
  quantity: number;
  image?: string;
  category?: string;
  brand?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  weight?: number;
  dimensions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

export interface ListProductsApiResponse extends ApiResponse<{
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {}

export interface GetProductApiResponse extends ApiResponse<Product> {}

export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string;
  price: number;
  cost?: number;
  quantity?: number;
  image?: string;
  category?: string;
  brand?: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  weight?: number;
  dimensions?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface UpdateStockData {
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}
