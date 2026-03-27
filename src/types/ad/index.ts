import type { ApiResponse } from '@/types/infrastructure';
import type { Product, ProductCatalogType } from '@/types/product';

export interface Advertiser {
  id: string;
  userId?: string;
  communityId?: string;
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

export interface AdvertiserProfile {
  id: string;
  advertiserId: string;
  key: string;
  locale: string;
  title?: string | null;
  value: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface ListAdsParams {
  page?: number;
  limit?: number;
  advertiserId?: string;
  productId?: string;
  status?: string;
  /** Um tipo ou vários separados por vírgula (ex.: listagem marketplace) */
  type?: string;
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

export type ListAdvertiserProfilesApiResponse = ApiResponse<{
  profiles: AdvertiserProfile[];
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
    type?: ProductCatalogType;
    externalUrl?: string;
    status?: 'active' | 'inactive' | 'out_of_stock';
  };
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive' | 'expired';
  targetAudience?: string;
}

export type UpdateAdData = Partial<CreateAdData>;
