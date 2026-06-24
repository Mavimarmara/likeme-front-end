import { categoryApiNameToCategoryId } from './index';

describe('categoryApiNameToCategoryId', () => {
  it('mapeia nomes da API para ids canônicos de categoria', () => {
    expect(categoryApiNameToCategoryId('Sono')).toBe('sleep');
    expect(categoryApiNameToCategoryId('Movimento')).toBe('activity');
    expect(categoryApiNameToCategoryId('Nutrição')).toBe('nutrition');
    expect(categoryApiNameToCategoryId('Saúde Bucal')).toBe('smile');
    expect(categoryApiNameToCategoryId('Propósito')).toBe('purpose-vision');
  });

  it('retorna null para nome desconhecido', () => {
    expect(categoryApiNameToCategoryId('Categoria inexistente')).toBeNull();
  });
});
