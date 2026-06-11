import { communityFileKindIconSource } from '@/utils/community/communityFileKindIconSource';

describe('communityFileKindIconSource', () => {
  it('retorna ícone por tipo de arquivo', () => {
    expect(communityFileKindIconSource('pdf')).toBeTruthy();
    expect(communityFileKindIconSource('spreadsheet')).toBeTruthy();
    expect(communityFileKindIconSource('document')).toBeTruthy();
    expect(communityFileKindIconSource('generic')).toBeTruthy();
  });
});
