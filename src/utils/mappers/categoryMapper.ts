import { PRODUCT_CATALOG_TYPE } from '@/types/product';

export const mapUICategoryToApiCategory = (uiCategory: string): string | undefined => {
  if (uiCategory === 'all') {
    return undefined;
  }

  if (uiCategory === 'products') {
    return [PRODUCT_CATALOG_TYPE.PHYSICAL, PRODUCT_CATALOG_TYPE.AMAZON].join(',');
  }

  if (uiCategory === 'specialists') {
    return PRODUCT_CATALOG_TYPE.PROGRAM;
  }

  if (uiCategory === 'programs') {
    return PRODUCT_CATALOG_TYPE.PROGRAM;
  }

  if (uiCategory === 'services') {
    return 'service';
  }

  return undefined;
};
