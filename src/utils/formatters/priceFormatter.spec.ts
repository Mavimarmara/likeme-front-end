/**
 * Testes unitários para PriceFormatter
 * 
 * Estes testes servem como documentação viva do comportamento esperado
 * do formatter de preços, demonstrando como lidar com diferentes cenários.
 */

import { PriceFormatter, formatPrice } from './priceFormatter';

describe('PriceFormatter', () => {
  describe('Constructor e normalização', () => {
    it('deve normalizar número válido corretamente', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.getValue()).toBe(29.99);
    });

    it('deve normalizar string numérica para número', () => {
      const formatter = new PriceFormatter('29.99' as any);
      expect(formatter.getValue()).toBe(29.99);
    });

    it('deve retornar 0 para null', () => {
      const formatter = new PriceFormatter(null);
      expect(formatter.getValue()).toBe(0);
    });

    it('deve retornar 0 para undefined', () => {
      const formatter = new PriceFormatter(undefined);
      expect(formatter.getValue()).toBe(0);
    });

    it('deve retornar 0 para NaN', () => {
      const formatter = new PriceFormatter(NaN);
      expect(formatter.getValue()).toBe(0);
    });

    it('deve retornar 0 para string inválida', () => {
      const formatter = new PriceFormatter('invalid' as any);
      expect(formatter.getValue()).toBe(0);
    });
  });

  describe('toUSD()', () => {
    it('deve formatar preço em dólares com 2 casas decimais', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.toUSD()).toBe('$29.99');
    });

    it('deve formatar preço inteiro com 2 casas decimais', () => {
      const formatter = new PriceFormatter(100);
      expect(formatter.toUSD()).toBe('$100.00');
    });

    it('deve formatar preço com muitas casas decimais corretamente', () => {
      const formatter = new PriceFormatter(29.999999);
      expect(formatter.toUSD()).toBe('$30.00');
    });

    it('deve formatar zero corretamente', () => {
      const formatter = new PriceFormatter(0);
      expect(formatter.toUSD()).toBe('$0.00');
    });

    it('deve formatar preço null como $0.00', () => {
      const formatter = new PriceFormatter(null);
      expect(formatter.toUSD()).toBe('$0.00');
    });
  });

  describe('toBRL()', () => {
    it('deve formatar preço em reais com 2 casas decimais', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.toBRL()).toBe('R$29.99');
    });

    it('deve formatar preço inteiro em reais', () => {
      const formatter = new PriceFormatter(100);
      expect(formatter.toBRL()).toBe('R$100.00');
    });

    it('deve formatar zero em reais', () => {
      const formatter = new PriceFormatter(0);
      expect(formatter.toBRL()).toBe('R$0.00');
    });
  });

  describe('format()', () => {
    it('deve formatar em USD por padrão', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.format()).toBe('$29.99');
    });

    it('deve formatar em USD quando especificado', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.format('USD')).toBe('$29.99');
    });

    it('deve formatar em BRL quando especificado', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.format('BRL')).toBe('R$29.99');
    });
  });

  describe('isValid()', () => {
    it('deve retornar true para preço maior que zero', () => {
      const formatter = new PriceFormatter(29.99);
      expect(formatter.isValid()).toBe(true);
    });

    it('deve retornar false para zero', () => {
      const formatter = new PriceFormatter(0);
      expect(formatter.isValid()).toBe(false);
    });

    it('deve retornar false para preço null', () => {
      const formatter = new PriceFormatter(null);
      expect(formatter.isValid()).toBe(false);
    });

    it('deve retornar false para preço negativo', () => {
      const formatter = new PriceFormatter(-10);
      expect(formatter.isValid()).toBe(false);
    });
  });
});

describe('formatPrice (função helper)', () => {
  it('deve formatar preço em USD por padrão', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
  });

  it('deve formatar preço em BRL quando especificado', () => {
    expect(formatPrice(29.99, 'BRL')).toBe('R$29.99');
  });

  it('deve lidar com null retornando $0.00', () => {
    expect(formatPrice(null)).toBe('$0.00');
  });

  it('deve lidar com undefined retornando $0.00', () => {
    expect(formatPrice(undefined)).toBe('$0.00');
  });

  it('deve lidar com NaN retornando $0.00', () => {
    expect(formatPrice(NaN)).toBe('$0.00');
  });

  it('deve formatar preço zero corretamente', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('deve formatar preço com muitas casas decimais', () => {
    expect(formatPrice(29.999999)).toBe('$30.00');
  });

  it('deve formatar preço inteiro com 2 casas decimais', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });
});
