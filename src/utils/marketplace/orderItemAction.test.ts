import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import { orderItemActionKey } from './orderItemAction';

describe('orderItemActionKey', () => {
  it('retorna viewProgram para programas', () => {
    expect(orderItemActionKey(PRODUCT_CATALOG_TYPE.PROGRAM)).toBe('viewProgram');
  });

  it('retorna addToCalendar para serviços', () => {
    expect(orderItemActionKey(PRODUCT_CATALOG_TYPE.SERVICE)).toBe('addToCalendar');
  });

  it('retorna null para produtos físicos', () => {
    expect(orderItemActionKey(PRODUCT_CATALOG_TYPE.PHYSICAL)).toBeNull();
  });
});
