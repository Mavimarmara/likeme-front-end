import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import { mapUICategoryToApiCategory } from './categoryMapper';

describe('categoryMapper', () => {
  describe('mapUICategoryToApiCategory', () => {
    it('deve retornar undefined para categoria "all"', () => {
      const result = mapUICategoryToApiCategory('all');
      expect(result).toBeUndefined();
    });

    it('deve mapear "products" para tipos de varejo (físico + Amazon)', () => {
      const result = mapUICategoryToApiCategory('products');
      expect(result).toBe([PRODUCT_CATALOG_TYPE.PHYSICAL, PRODUCT_CATALOG_TYPE.AMAZON].join(','));
    });

    it('deve mapear "programs" para programa', () => {
      const result = mapUICategoryToApiCategory('programs');
      expect(result).toBe(PRODUCT_CATALOG_TYPE.PROGRAM);
    });

    it('deve mapear "specialists" para programa', () => {
      const result = mapUICategoryToApiCategory('specialists');
      expect(result).toBe(PRODUCT_CATALOG_TYPE.PROGRAM);
    });

    it('deve mapear "services" para serviço', () => {
      const result = mapUICategoryToApiCategory('services');
      expect(result).toBe('service');
    });

    it('deve retornar undefined para categoria desconhecida', () => {
      const result = mapUICategoryToApiCategory('unknown');
      expect(result).toBeUndefined();
    });

    it('deve retornar undefined para string vazia', () => {
      const result = mapUICategoryToApiCategory('');
      expect(result).toBeUndefined();
    });
  });
});
