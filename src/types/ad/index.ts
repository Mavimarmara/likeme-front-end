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
  title: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'expired';
  targetAudience?: string;
  budget?: number;
  externalUrl?: string;
  category?: 'amazon product' | 'physical product' | 'program';
  createdAt: string;
  updatedAt: string;
  advertiser?: Advertiser;
  product?: Product;
}

export interface ListAdsParams {
  page?: number;
  limit?: number;
  advertiserId?: string;
  productId?: string;
  status?: string;
  category?: 'amazon product' | 'physical product' | 'program';
  activeOnly?: boolean;
}

export interface ListAdsApiResponse extends ApiResponse<{
  ads: Ad[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {}

export interface GetAdApiResponse extends ApiResponse<Ad> {}

export interface CreateAdData {
  advertiserId?: string;
  productId?: string;
  title: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive' | 'expired';
  targetAudience?: string;
  budget?: number;
  externalUrl?: string;
  category?: 'amazon product' | 'physical product' | 'program';
}

export interface UpdateAdData extends Partial<CreateAdData> {}
