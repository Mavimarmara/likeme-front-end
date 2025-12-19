import type { ApiResponse } from '@/types/infrastructure';

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
  product?: Product; // Product contains: name, description, image, externalUrl, category
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price?: number; // Optional when externalUrl is provided
  cost?: number;
  quantity?: number; // Optional when externalUrl is provided
  image?: string;
  category?: 'amazon product' | 'physical product' | 'program' | string;
  brand?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  weight?: number;
  dimensions?: string;
  externalUrl?: string; // External URL for the product (e.g., Amazon product link)
  createdAt: string;
  updatedAt: string;
  ads?: Ad[];
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
  price?: number; // Optional when externalUrl is provided
  cost?: number;
  quantity?: number; // Optional when externalUrl is provided
  image?: string;
  category?: 'amazon product' | 'physical product' | 'program' | string;
  brand?: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  weight?: number;
  dimensions?: string;
  externalUrl?: string; // External URL for the product (e.g., Amazon product link)
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface UpdateStockData {
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}
