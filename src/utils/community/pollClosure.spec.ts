import { isPollClosed, resolvePollState } from '@/utils/community/pollClosure';

describe('pollClosure', () => {
  const now = new Date('2026-06-10T12:00:00.000Z');

  it('encerra enquete quando data de término já passou', () => {
    expect(isPollClosed({ endDate: '2026-06-09T12:00:00.000Z' }, now)).toBe(true);
  });

  it('mantém enquete aberta quando data de término é futura', () => {
    expect(isPollClosed({ endDate: '2026-06-11T12:00:00.000Z' }, now)).toBe(false);
  });

  it('resolve estado com endedAt para exibição', () => {
    const state = resolvePollState({ endDate: '2026-06-09T12:00:00.000Z' }, now);
    expect(state.isClosed).toBe(true);
    expect(state.endedAt?.toISOString()).toBe('2026-06-09T12:00:00.000Z');
  });
});
