import { useEffect, useMemo, useState } from 'react';
import advertiserService from '@/services/advertiser/advertiserService';
import type { Ad, Advertiser } from '@/types/ad';
import type { Contact } from '@/types/contact';
import type { Product as ApiProduct } from '@/types/product';
import { logger } from '@/utils/logger';

function hasUsableContacts(contacts: Contact[] | undefined): boolean {
  return Array.isArray(contacts) && contacts.some((contact) => String(contact.value ?? '').trim().length > 0);
}

export type ProductPartnerRouteProduct = {
  provider?: {
    name?: string;
    avatar?: string;
    description?: string;
    title?: string;
    specialties?: string[];
  };
};

export type ProductPartnerData = {
  id: string;
  name: string;
  avatar: string;
  description: string;
  title: string;
  specialties: string[];
};

type Params = {
  product: ApiProduct | null;
  ad: Ad | null;
  advertiserId: string | undefined;
  routeProduct?: ProductPartnerRouteProduct | null;
  productIdFallback?: string;
};

export function useProductPartner({ product, ad, advertiserId, routeProduct, productIdFallback }: Params) {
  const [fetchedAdvertiser, setFetchedAdvertiser] = useState<Advertiser | null>(null);

  const nestedAdvertiser = ad?.advertiser;

  useEffect(() => {
    if (hasUsableContacts(nestedAdvertiser?.contacts)) {
      setFetchedAdvertiser(null);
      return;
    }

    const id = advertiserId?.trim();
    if (!id) {
      setFetchedAdvertiser(null);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await advertiserService.getAdvertiserById(id);
        if (cancelled) {
          return;
        }
        if (response.success && response.data) {
          setFetchedAdvertiser(response.data);
        }
      } catch (error) {
        logger.error('[useProductPartner] Falha ao carregar advertiser do produto', {
          advertiserId: id,
          error,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nestedAdvertiser?.id, nestedAdvertiser?.contacts, advertiserId]);

  const partnerData = useMemo((): ProductPartnerData => {
    const source = nestedAdvertiser ?? fetchedAdvertiser;
    if (source) {
      return {
        id: source.id,
        name: source.name ?? '',
        avatar: source.logo ?? '',
        description: source.description ?? '',
        title: '',
        specialties: [],
      };
    }

    const productWithProvider = product as { provider?: ProductPartnerRouteProduct['provider'] };
    const provider = routeProduct?.provider ?? productWithProvider?.provider;

    return {
      id: advertiserId ?? product?.id ?? productIdFallback ?? '',
      name: provider?.name ?? '',
      avatar: provider?.avatar ?? '',
      description: provider?.description ?? '',
      title: provider?.title ?? '',
      specialties: provider?.specialties ?? [],
    };
  }, [nestedAdvertiser, fetchedAdvertiser, product, routeProduct, advertiserId, productIdFallback]);

  const hasSpecialistPartner = useMemo(() => Boolean(partnerData.name?.trim()), [partnerData.name]);

  const partnerDisplayName = useMemo(() => {
    if (!hasSpecialistPartner) {
      return '';
    }
    return partnerData.name.trim();
  }, [hasSpecialistPartner, partnerData.name]);

  return {
    partnerData,
    hasSpecialistPartner,
    partnerDisplayName,
    partnerContacts: hasUsableContacts(nestedAdvertiser?.contacts)
      ? nestedAdvertiser?.contacts
      : fetchedAdvertiser?.contacts,
  };
}
