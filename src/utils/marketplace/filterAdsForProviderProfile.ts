import type { Ad } from '@/types/ad';

export function filterAdsForProviderProfile(
  ads: Ad[],
  providerAdvertiserId: string,
  providerUserId?: string | null,
): Ad[] {
  const pid = providerAdvertiserId.trim();
  if (!pid) {
    return [];
  }

  const puid = providerUserId != null ? String(providerUserId).trim() : '';

  return ads.filter((ad) => {
    const advId = ad.advertiserId?.trim();
    const nestedId = ad.advertiser?.id?.trim();
    const matchesAdvertiser = advId === pid || nestedId === pid;
    if (!matchesAdvertiser) {
      return false;
    }

    if (puid === '') {
      return true;
    }

    const ownerUid = ad.advertiser?.userId?.trim();
    if (ownerUid) {
      return ownerUid === puid;
    }

    return true;
  });
}
