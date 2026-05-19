import { commentCreatedAtLabel, parseCommentCreatedAt } from '@/utils/community/commentCreatedAtLabel';

describe('parseCommentCreatedAt', () => {
  it('aceita ISO string', () => {
    const date = parseCommentCreatedAt('2026-05-10T10:00:00.000Z');
    expect(date?.toISOString()).toBe('2026-05-10T10:00:00.000Z');
  });

  it('aceita epoch em segundos', () => {
    const date = parseCommentCreatedAt(1715331600);
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBeGreaterThan(2020);
  });
});

describe('commentCreatedAtLabel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-18T15:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('mostra minutos abaixo de 1 hora', () => {
    const iso = new Date('2026-05-18T14:30:00.000Z').toISOString();
    expect(commentCreatedAtLabel(iso)).toBe('30 min');
  });

  it('mostra horas abaixo de 24 horas', () => {
    const iso = new Date('2026-05-18T10:00:00.000Z').toISOString();
    expect(commentCreatedAtLabel(iso)).toBe('5h');
  });

  it('mostra dia e mês abreviado após 24 horas', () => {
    const iso = new Date('2026-05-10T10:00:00.000Z').toISOString();
    expect(commentCreatedAtLabel(iso, 'pt-BR')).toBe('10 mai');
  });

  it('não retorna vazio para data antiga sem formatToParts', () => {
    const iso = new Date('2024-03-15T12:00:00.000Z').toISOString();
    expect(commentCreatedAtLabel(iso, 'pt-BR').length).toBeGreaterThan(0);
  });
});
