import { PRODUCT_CATALOG_TYPE } from '@/types/product';

export type OrderItemActionKey = 'viewProgram' | 'addToCalendar';

export function orderItemActionKey(catalogType: string | undefined | null): OrderItemActionKey | null {
  if (catalogType === PRODUCT_CATALOG_TYPE.PROGRAM) {
    return 'viewProgram';
  }
  if (catalogType === PRODUCT_CATALOG_TYPE.SERVICE) {
    return 'addToCalendar';
  }
  return null;
}
