import {
  communityFileKind,
  communityFileDisplayName,
  communityFileExtension,
} from '@/utils/community/communityFileKind';

describe('communityFileKind', () => {
  it('detecta PDF por mime type', () => {
    expect(
      communityFileKind({
        fileUrl: 'https://cdn.example.com/report',
        attributes: { mimeType: 'application/pdf', name: 'report.pdf' },
      }),
    ).toBe('pdf');
  });

  it('detecta planilha por extensão', () => {
    expect(
      communityFileKind({
        fileUrl: 'https://cdn.example.com/data.xlsx',
      }),
    ).toBe('spreadsheet');
  });

  it('detecta documento de texto', () => {
    expect(
      communityFileKind({
        fileUrl: 'https://cdn.example.com/nota.docx',
        attributes: { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      }),
    ).toBe('document');
  });

  it('detecta vídeo por mime type', () => {
    expect(
      communityFileKind({
        fileUrl: 'https://cdn.example.com/clip.mp4',
        attributes: { mimeType: 'video/mp4' },
      }),
    ).toBe('video');
  });

  it('usa attributes.name e extension quando disponíveis', () => {
    const row = {
      fileUrl: 'https://cdn.example.com/download?id=1',
      attributes: { name: 'Plano alimentar', extension: 'pdf' },
    };
    expect(communityFileDisplayName(row)).toBe('Plano alimentar');
    expect(communityFileExtension(row)).toBe('pdf');
  });
});
