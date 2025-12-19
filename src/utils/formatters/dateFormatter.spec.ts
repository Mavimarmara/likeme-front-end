/**
 * Testes unitários para DateFormatter
 * 
 * Estes testes servem como documentação viva do comportamento esperado
 * do formatter de datas, demonstrando diferentes formatos de saída.
 */

import { DateFormatter, formatDate, formatDateTime } from './dateFormatter';

describe('DateFormatter', () => {
  const testDate = new Date('2023-12-25T14:30:00');

  describe('Constructor', () => {
    it('deve aceitar objeto Date', () => {
      const formatter = new DateFormatter(testDate);
      expect(formatter.getDate()).toEqual(testDate);
    });

    it('deve aceitar string de data', () => {
      const formatter = new DateFormatter('2023-12-25');
      expect(formatter.getDate()).toBeInstanceOf(Date);
    });

    it('deve aceitar timestamp numérico', () => {
      const timestamp = testDate.getTime();
      const formatter = new DateFormatter(timestamp);
      expect(formatter.getDate()).toBeInstanceOf(Date);
    });
  });

  describe('toShortDate()', () => {
    it('deve formatar data no formato curto (ex: "25 Dec" ou "Dec 25")', () => {
      const formatter = new DateFormatter(testDate);
      const formatted = formatter.toShortDate();
      // Aceita ambos os formatos: "25 Dec" ou "Dec 25"
      expect(formatted).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2})/);
      expect(formatted).toContain('Dec');
    });

    it('deve formatar data corretamente para diferentes meses', () => {
      const janDate = new Date('2023-01-15');
      const formatter = new DateFormatter(janDate);
      const formatted = formatter.toShortDate();
      expect(formatted).toContain('Jan');
    });
  });

  describe('toLongDate()', () => {
    it('deve formatar data no formato longo (ex: "25 December 2023" ou "December 25, 2023")', () => {
      const formatter = new DateFormatter(testDate);
      const formatted = formatter.toLongDate();
      // Aceita ambos os formatos: "25 December 2023" ou "December 25, 2023"
      expect(formatted).toMatch(/(\d{1,2} \w+ \d{4}|\w+ \d{1,2}, \d{4})/);
      expect(formatted).toContain('December');
      expect(formatted).toContain('2023');
    });
  });

  describe('toTime()', () => {
    it('deve formatar hora no formato 12h com AM/PM', () => {
      const formatter = new DateFormatter(testDate);
      const formatted = formatter.toTime();
      expect(formatted).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('deve formatar hora da manhã corretamente', () => {
      const morningDate = new Date('2023-12-25T09:30:00');
      const formatter = new DateFormatter(morningDate);
      const formatted = formatter.toTime();
      expect(formatted).toContain('AM');
    });

    it('deve formatar hora da tarde corretamente', () => {
      const afternoonDate = new Date('2023-12-25T15:30:00');
      const formatter = new DateFormatter(afternoonDate);
      const formatted = formatter.toTime();
      expect(formatted).toContain('PM');
    });
  });

  describe('toDateTime()', () => {
    it('deve combinar data curta e hora', () => {
      const formatter = new DateFormatter(testDate);
      const formatted = formatter.toDateTime();
      // Aceita ambos os formatos: "25 Dec at ..." ou "Dec 25 at ..."
      expect(formatted).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2}) at \d{1,2}:\d{2} (AM|PM)/);
      expect(formatted).toContain('at');
    });
  });

  describe('isValid()', () => {
    it('deve retornar true para data válida', () => {
      const formatter = new DateFormatter(testDate);
      expect(formatter.isValid()).toBe(true);
    });

    it('deve retornar false para data inválida', () => {
      const formatter = new DateFormatter(new Date('invalid'));
      expect(formatter.isValid()).toBe(false);
    });
  });

  describe('getDate()', () => {
    it('deve retornar objeto Date original', () => {
      const formatter = new DateFormatter(testDate);
      expect(formatter.getDate()).toBeInstanceOf(Date);
      expect(formatter.getDate().getTime()).toBe(testDate.getTime());
    });
  });
});

describe('formatDate (função helper)', () => {
  it('deve formatar data no formato curto', () => {
    const formatted = formatDate(new Date('2023-12-25'));
    // Aceita ambos os formatos: "25 Dec" ou "Dec 25"
    expect(formatted).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2})/);
  });

  it('deve aceitar string de data', () => {
    const formatted = formatDate('2023-12-25');
    // Aceita ambos os formatos: "25 Dec" ou "Dec 25"
    expect(formatted).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2})/);
  });

  it('deve aceitar timestamp', () => {
    const timestamp = new Date('2023-12-25').getTime();
    const formatted = formatDate(timestamp);
    // Aceita ambos os formatos: "25 Dec" ou "Dec 25"
    expect(formatted).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2})/);
  });
});

describe('formatDateTime (função helper)', () => {
  it('deve formatar data e hora juntas', () => {
    const formatted = formatDateTime(new Date('2023-12-25T14:30:00'));
    // Aceita ambos os formatos: "25 Dec at ..." ou "Dec 25 at ..."
    expect(formatted).toMatch(/(\d{1,2} \w{3}|\w{3} \d{1,2}) at \d{1,2}:\d{2} (AM|PM)/);
  });

  it('deve incluir "at" entre data e hora', () => {
    const formatted = formatDateTime(new Date('2023-12-25T14:30:00'));
    expect(formatted).toContain('at');
  });
});
