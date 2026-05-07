import { compareSemanticVersions } from '@/utils/version/compareSemanticVersions';

describe('compareSemanticVersions', () => {
  it('ordena corretamente', () => {
    expect(compareSemanticVersions('1.0.0', '1.0.1')).toBe(-1);
    expect(compareSemanticVersions('2.0.0', '1.9.9')).toBe(1);
    expect(compareSemanticVersions('1.2.3', '1.2.3')).toBe(0);
  });
});
