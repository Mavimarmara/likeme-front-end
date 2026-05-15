import { markdownBlocksToPlainText, parseMarkdownBlocks } from '@/utils/parseMarkdownBlocks';

describe('parseMarkdownBlocks', () => {
  it('agrupa parágrafos separados por linha em branco', () => {
    expect(parseMarkdownBlocks('Linha 1\n\nLinha 2')).toEqual([
      { type: 'paragraph', text: 'Linha 1' },
      { type: 'spacer' },
      { type: 'paragraph', text: 'Linha 2' },
    ]);
  });

  it('preserva quebra de linha dentro do parágrafo', () => {
    expect(parseMarkdownBlocks('Linha 1\nLinha 2')).toEqual([{ type: 'paragraph', text: 'Linha 1\nLinha 2' }]);
  });

  it('reconhece lista não ordenada com -, * ou •', () => {
    expect(parseMarkdownBlocks('- um\n* dois\n• três')).toEqual([
      { type: 'unordered-list', items: ['um', 'dois', 'três'] },
    ]);
  });

  it('reconhece lista ordenada', () => {
    expect(parseMarkdownBlocks('1. primeiro\n2) segundo')).toEqual([
      { type: 'ordered-list', items: ['primeiro', 'segundo'] },
    ]);
  });

  it('alterna parágrafo e lista', () => {
    const blocks = parseMarkdownBlocks('Intro\n\n- item A\n- item B\n\nFim');
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'Intro' },
      { type: 'spacer' },
      { type: 'unordered-list', items: ['item A', 'item B'] },
      { type: 'spacer' },
      { type: 'paragraph', text: 'Fim' },
    ]);
  });

  it('markdownBlocksToPlainText junta blocos', () => {
    const blocks = parseMarkdownBlocks('A\n\n- x');
    expect(markdownBlocksToPlainText(blocks)).toBe('A\n\nx');
  });
});
