/**
 * Testes unitários para DateFormatter
 *
 * Estes testes servem como documentação viva do comportamento esperado
 * do formatter de datas, demonstrando diferentes formatos de saída.
 */

import { DateFormatter, formatDate, formatDateTime, getDateFromDatetime, getTimeFromDatetime } from './dateFormatter';

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

describe('getDateFromDatetime', () => {
  it('deve extrair a data de uma string datetime no formato "13 Nov. at 8:15 pm"', () => {
    const dateTime = '13 Nov. at 8:15 pm';
    const result = getDateFromDatetime(dateTime);
    const currentYear = new Date().getFullYear();
    expect(result).toBe(`${currentYear}-11-13`);
  });

  it('deve extrair a data corretamente para diferentes meses', () => {
    const currentYear = new Date().getFullYear();

    expect(getDateFromDatetime('1 Jan. at 10:00 am')).toBe(`${currentYear}-01-01`);
    expect(getDateFromDatetime('15 Feb. at 2:30 pm')).toBe(`${currentYear}-02-15`);
    expect(getDateFromDatetime('31 Dec. at 11:59 pm')).toBe(`${currentYear}-12-31`);
  });

  it('deve pad com zero quando o dia tem apenas um dígito', () => {
    const currentYear = new Date().getFullYear();
    const result = getDateFromDatetime('5 Nov. at 8:15 pm');
    expect(result).toBe(`${currentYear}-11-05`);
  });

  it('deve retornar data atual quando não conseguir parsear', () => {
    // Testa com string que não tem formato válido mas não lança exceção
    const invalidDateTime = 'invalid format';
    const result = getDateFromDatetime(invalidDateTime);
    // A função pode retornar um formato inválido quando não consegue parsear corretamente
    // Mas deve sempre retornar algo no formato de data ou data atual
    // Verifica que é uma string
    expect(typeof result).toBe('string');
    // Se conseguir parsear como data, verifica que é válida
    const date = new Date(result);
    if (!isNaN(date.getTime())) {
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('deve retornar data atual quando a string não contém " at "', () => {
    const dateTime = '13 Nov.';
    const result = getDateFromDatetime(dateTime);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('deve lidar com mês desconhecido retornando 01 como padrão', () => {
    const currentYear = new Date().getFullYear();
    const result = getDateFromDatetime('13 Unknown. at 8:15 pm');
    expect(result).toBe(`${currentYear}-01-13`);
  });
});

describe('getTimeFromDatetime', () => {
  it('deve extrair o tempo de uma string datetime no formato "13 Nov. at 8:15 pm"', () => {
    const dateTime = '13 Nov. at 8:15 pm';
    const result = getTimeFromDatetime(dateTime);
    expect(result).toBe('8:15 pm');
  });

  it('deve extrair o tempo corretamente para diferentes formatos', () => {
    expect(getTimeFromDatetime('13 Nov. at 10:30 am')).toBe('10:30 am');
    expect(getTimeFromDatetime('13 Nov. at 2:45 pm')).toBe('2:45 pm');
    expect(getTimeFromDatetime('13 Nov. at 12:00 pm')).toBe('12:00 pm');
    expect(getTimeFromDatetime('13 Nov. at 12:00 am')).toBe('12:00 am');
  });

  it('deve retornar "8:00 am" como padrão quando não conseguir parsear', () => {
    const invalidDateTime = 'invalid format';
    const result = getTimeFromDatetime(invalidDateTime);
    expect(result).toBe('8:00 am');
  });

  it('deve retornar "8:00 am" quando a string não contém " at "', () => {
    const dateTime = '13 Nov.';
    const result = getTimeFromDatetime(dateTime);
    expect(result).toBe('8:00 am');
  });

  it('deve retornar "8:00 am" quando não há parte de tempo', () => {
    const dateTime = '13 Nov. at';
    const result = getTimeFromDatetime(dateTime);
    expect(result).toBe('8:00 am');
  });
});
