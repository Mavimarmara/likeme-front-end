import { markdownToPlainText, parseMarkdownSegments } from '@/utils/parseMarkdown';

describe('parseMarkdownSegments / markdownToPlainText', () => {
  it('texto sem marcadores', () => {
    expect(markdownToPlainText('Olá')).toBe('Olá');
    expect(parseMarkdownSegments('Olá')).toEqual([{ text: 'Olá', bold: false, italic: false, underline: false }]);
  });

  it('remove negrito', () => {
    expect(markdownToPlainText('a **b** c')).toBe('a b c');
  });

  it('remove itálico', () => {
    expect(markdownToPlainText('a *b* c')).toBe('a b c');
  });

  it('remove sublinhado', () => {
    expect(markdownToPlainText('a __b__ c')).toBe('a b c');
  });

  it('preserva newline', () => {
    expect(markdownToPlainText('linha1\nlinha2')).toBe('linha1\nlinha2');
  });

  it('preserva underscore único', () => {
    expect(markdownToPlainText('a_b')).toBe('a_b');
  });
});
