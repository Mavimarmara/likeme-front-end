import type { Advertiser } from '@/types/ad';

export type RouteProductProvider = {
  name: string;
  avatar: string;
  description?: string;
};

export function advertiserToRouteProductProvider(advertiser: Advertiser | undefined): RouteProductProvider | undefined {
  const name = advertiser?.name?.trim();
  if (!name) {
    return undefined;
  }

  return {
    name,
    avatar: advertiser?.logo ?? '',
    description: advertiser?.description,
  };
}
