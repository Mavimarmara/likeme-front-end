import { mapUICategoryToApiCategory } from './categoryMapper';

describe('categoryMapper', () => {
  describe('mapUICategoryToApiCategory', () => {
    it('deve retornar undefined para categoria "all"', () => {
      const result = mapUICategoryToApiCategory('all');
      expect(result).toBeUndefined();
    });

    it('deve mapear "products" para "physical product"', () => {
      const result = mapUICategoryToApiCategory('products');
      expect(result).toBe('physical product');
    });

    it('deve mapear "programs" para "program"', () => {
      const result = mapUICategoryToApiCategory('programs');
      expect(result).toBe('program');
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
