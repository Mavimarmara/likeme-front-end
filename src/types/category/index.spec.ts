import { categoryApiNameToCategoryId } from './index';

describe('categoryApiNameToCategoryId', () => {
  it('mapeia nomes da API para ids canônicos de categoria', () => {
    expect(categoryApiNameToCategoryId('Sono')).toBe('sleep');
    expect(categoryApiNameToCategoryId('Atividade')).toBe('activity');
    expect(categoryApiNameToCategoryId('Movimento')).toBe('activity');
    expect(categoryApiNameToCategoryId('Conexão')).toBe('connection');
    expect(categoryApiNameToCategoryId('Nutrição')).toBe('nutrition');
    expect(categoryApiNameToCategoryId('Saúde Bucal')).toBe('smile');
    expect(categoryApiNameToCategoryId('Propósito')).toBe('purpose-vision');
    expect(categoryApiNameToCategoryId('Propósito e visão')).toBe('purpose-vision');
    expect(categoryApiNameToCategoryId('Proposito e visao')).toBe('purpose-vision');
  });

  it('preserva compatibilidade com nomes legados de objetivos pessoais', () => {
    expect(categoryApiNameToCategoryId('Improve my sleep')).toBe('sleep');
    expect(categoryApiNameToCategoryId('Move more')).toBe('activity');
    expect(categoryApiNameToCategoryId('Find a comunity')).toBe('connection');
    expect(categoryApiNameToCategoryId('Purpose & vision')).toBe('purpose-vision');
    expect(categoryApiNameToCategoryId('Get to know me better')).toBe('purpose-vision');
    expect(categoryApiNameToCategoryId('Gain insights on my wellbeing')).toBe('stress');
  });

  it('retorna null para nome desconhecido', () => {
    expect(categoryApiNameToCategoryId('Categoria inexistente')).toBeNull();
  });
});
