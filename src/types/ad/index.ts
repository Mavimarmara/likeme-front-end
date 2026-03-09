import type { ApiResponse } from '@/types/infrastructure';
import type { Product } from '@/types/product';

export interface Advertiser {
  id: string;
  userId?: string;
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
  product?: Product; // Product contains: name, description, image, externalUrl, type
}

export interface ListAdsParams {
  page?: number;
  limit?: number;
  advertiserId?: string;
  productId?: string;
  status?: string;
  type?: 'amazon product' | 'physical product' | 'program';
  categoryId?: string; // domain category (Estresse, Sono, etc.)
  activeOnly?: boolean;
  search?: string;
}

export type ListAdsApiResponse = ApiResponse<{
  ads: Ad[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export type GetAdApiResponse = ApiResponse<Ad>;

export type GetAdvertiserApiResponse = ApiResponse<Advertiser>;

export type ListAdvertisersApiResponse = ApiResponse<{
  advertisers: Advertiser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}>;

export interface CreateAdData {
  advertiserId?: string;
  productId?: string;
  product?: {
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    quantity?: number;
    type?: 'amazon product' | 'physical product' | 'program';
    externalUrl?: string;
    status?: 'active' | 'inactive' | 'out_of_stock';
  };
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive' | 'expired';
  targetAudience?: string;
}

export type UpdateAdData = Partial<CreateAdData>;
