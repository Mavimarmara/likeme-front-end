/**
 * Testes unitários para dateTimeSorter
 *
 * Estes testes verificam o comportamento das funções de ordenação
 * por data e hora, incluindo diferentes formatos e casos extremos.
 */

import { sortByDateTime, sortByDateField, sortByDateObject, SortOrder } from './dateTimeSorter';

describe('dateTimeSorter', () => {
  describe('sortByDateTime', () => {
    interface TestItem {
      id: string;
      dateTime?: string | null;
      name: string;
    }

    it('deve ordenar por dateTime em ordem descendente (padrão)', () => {
      const items: TestItem[] = [
        { id: '1', dateTime: '2023-01-01T10:00:00Z', name: 'First' },
        { id: '2', dateTime: '2023-01-03T10:00:00Z', name: 'Third' },
        { id: '3', dateTime: '2023-01-02T10:00:00Z', name: 'Second' },
      ];

      const sorted = sortByDateTime(items);
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    it('deve ordenar por dateTime em ordem ascendente', () => {
      const items: TestItem[] = [
        { id: '1', dateTime: '2023-01-01T10:00:00Z', name: 'First' },
        { id: '2', dateTime: '2023-01-03T10:00:00Z', name: 'Third' },
        { id: '3', dateTime: '2023-01-02T10:00:00Z', name: 'Second' },
      ];

      const sorted = sortByDateTime(items, 'asc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });

    it('deve lidar com items sem dateTime (colocá-los no final)', () => {
      const items: TestItem[] = [
        { id: '1', dateTime: '2023-01-02T10:00:00Z', name: 'With Date' },
        { id: '2', dateTime: null, name: 'No Date' },
        { id: '3', dateTime: '2023-01-01T10:00:00Z', name: 'With Date 2' },
      ];

      const sorted = sortByDateTime(items, 'desc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2'); // Sem dateTime vai para o final
    });

    it('deve usar extractor customizado quando fornecido', () => {
      interface CustomItem {
        id: string;
        customDate?: string;
      }

      const items: CustomItem[] = [
        { id: '1', customDate: '2023-01-03T10:00:00Z' },
        { id: '2', customDate: '2023-01-01T10:00:00Z' },
        { id: '3', customDate: '2023-01-02T10:00:00Z' },
      ];

      const sorted = sortByDateTime(items as any, 'desc', (item) => item.customDate);

      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });

    it('deve lidar com dateTime inválido', () => {
      const items: TestItem[] = [
        { id: '1', dateTime: 'invalid-date', name: 'Invalid' },
        { id: '2', dateTime: '2023-01-01T10:00:00Z', name: 'Valid' },
      ];

      const sorted = sortByDateTime(items, 'desc');
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
    });

    it('não deve modificar o array original', () => {
      const items: TestItem[] = [
        { id: '1', dateTime: '2023-01-02T10:00:00Z', name: 'Second' },
        { id: '2', dateTime: '2023-01-01T10:00:00Z', name: 'First' },
      ];

      const original = [...items];
      sortByDateTime(items);
      expect(items).toEqual(original);
    });
  });

  describe('sortByDateField', () => {
    interface TestItem {
      id: string;
      createdAt: string;
      updatedAt?: string;
      name: string;
    }

    it('deve ordenar por campo de data específico em ordem descendente', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: '2023-01-01T10:00:00Z', name: 'First' },
        { id: '2', createdAt: '2023-01-03T10:00:00Z', name: 'Third' },
        { id: '3', createdAt: '2023-01-02T10:00:00Z', name: 'Second' },
      ];

      const sorted = sortByDateField(items, 'createdAt', 'desc');
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    it('deve ordenar por campo de data específico em ordem ascendente', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: '2023-01-01T10:00:00Z', name: 'First' },
        { id: '2', createdAt: '2023-01-03T10:00:00Z', name: 'Third' },
        { id: '3', createdAt: '2023-01-02T10:00:00Z', name: 'Second' },
      ];

      const sorted = sortByDateField(items, 'createdAt', 'asc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });

    it('deve ordenar por diferentes campos de data', () => {
      const items: TestItem[] = [
        {
          id: '1',
          createdAt: '2023-01-01T10:00:00Z',
          updatedAt: '2023-01-05T10:00:00Z',
          name: 'First',
        },
        {
          id: '2',
          createdAt: '2023-01-03T10:00:00Z',
          updatedAt: '2023-01-02T10:00:00Z',
          name: 'Second',
        },
        {
          id: '3',
          createdAt: '2023-01-02T10:00:00Z',
          updatedAt: '2023-01-04T10:00:00Z',
          name: 'Third',
        },
      ];

      const sortedByCreated = sortByDateField(items, 'createdAt', 'desc');
      expect(sortedByCreated[0].id).toBe('2');

      const sortedByUpdated = sortByDateField(items, 'updatedAt', 'desc');
      expect(sortedByUpdated[0].id).toBe('1');
    });

    it('deve lidar com campos de data nulos ou undefined', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: '2023-01-02T10:00:00Z', name: 'With Date' },
        { id: '2', createdAt: null as any, name: 'No Date' },
        { id: '3', createdAt: '2023-01-01T10:00:00Z', name: 'With Date 2' },
      ];

      const sorted = sortByDateField(items, 'createdAt', 'desc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });

    it('não deve modificar o array original', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: '2023-01-02T10:00:00Z', name: 'Second' },
        { id: '2', createdAt: '2023-01-01T10:00:00Z', name: 'First' },
      ];

      const original = [...items];
      sortByDateField(items, 'createdAt');
      expect(items).toEqual(original);
    });
  });

  describe('sortByDateObject', () => {
    interface TestItem {
      id: string;
      createdAt: Date;
      updatedAt?: Date | null;
      name: string;
    }

    it('deve ordenar por objeto Date em ordem descendente', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: new Date('2023-01-01T10:00:00Z'), name: 'First' },
        { id: '2', createdAt: new Date('2023-01-03T10:00:00Z'), name: 'Third' },
        { id: '3', createdAt: new Date('2023-01-02T10:00:00Z'), name: 'Second' },
      ];

      const sorted = sortByDateObject(items, 'createdAt', 'desc');
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    it('deve ordenar por objeto Date em ordem ascendente', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: new Date('2023-01-01T10:00:00Z'), name: 'First' },
        { id: '2', createdAt: new Date('2023-01-03T10:00:00Z'), name: 'Third' },
        { id: '3', createdAt: new Date('2023-01-02T10:00:00Z'), name: 'Second' },
      ];

      const sorted = sortByDateObject(items, 'createdAt', 'asc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });

    it('deve lidar com objetos Date nulos ou undefined', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: new Date('2023-01-02T10:00:00Z'), name: 'With Date' },
        {
          id: '2',
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: null,
          name: 'No Updated',
        },
        {
          id: '3',
          createdAt: new Date('2023-01-03T10:00:00Z'),
          updatedAt: new Date('2023-01-04T10:00:00Z'),
          name: 'With Updated',
        },
      ];

      const sorted = sortByDateObject(items, 'createdAt', 'desc');
      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('2');

      const sortedByUpdated = sortByDateObject(items, 'updatedAt', 'desc');
      expect(sortedByUpdated[0].id).toBe('3');
      expect(sortedByUpdated[1].id).toBe('1');
      expect(sortedByUpdated[2].id).toBe('2');
    });

    it('deve ordenar corretamente quando há datas iguais', () => {
      const sameDate = new Date('2023-01-01T10:00:00Z');
      const items: TestItem[] = [
        { id: '1', createdAt: sameDate, name: 'First' },
        { id: '2', createdAt: sameDate, name: 'Second' },
        { id: '3', createdAt: new Date('2023-01-02T10:00:00Z'), name: 'Third' },
      ];

      const sorted = sortByDateObject(items, 'createdAt', 'desc');
      expect(sorted[0].id).toBe('3');
      // Os dois primeiros podem estar em qualquer ordem já que têm a mesma data
      expect(['1', '2']).toContain(sorted[1].id);
      expect(['1', '2']).toContain(sorted[2].id);
    });

    it('não deve modificar o array original', () => {
      const items: TestItem[] = [
        { id: '1', createdAt: new Date('2023-01-02T10:00:00Z'), name: 'Second' },
        { id: '2', createdAt: new Date('2023-01-01T10:00:00Z'), name: 'First' },
      ];

      const original = [...items];
      sortByDateObject(items, 'createdAt');
      expect(items).toEqual(original);
    });

    it('deve lidar com array vazio', () => {
      const items: TestItem[] = [];
      const sorted = sortByDateObject(items, 'createdAt');
      expect(sorted).toEqual([]);
    });

    it('deve lidar com array com um único item', () => {
      const items: TestItem[] = [{ id: '1', createdAt: new Date('2023-01-01T10:00:00Z'), name: 'Only' }];

      const sorted = sortByDateObject(items, 'createdAt');
      expect(sorted).toEqual(items);
    });
  });
});
