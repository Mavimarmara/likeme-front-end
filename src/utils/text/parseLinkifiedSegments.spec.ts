import { parseLinkifiedPlainText } from './parseLinkifiedSegments';

describe('parseLinkifiedPlainText', () => {
  it('retorna texto puro quando não há links', () => {
    expect(parseLinkifiedPlainText('Apenas texto.')).toEqual([{ kind: 'text', text: 'Apenas texto.' }]);
  });

  it('detecta URL com https', () => {
    const s = parseLinkifiedPlainText('Veja https://exemplo.com/path fim');
    expect(s).toEqual([
      { kind: 'text', text: 'Veja ' },
      { kind: 'url', text: 'https://exemplo.com/path', href: 'https://exemplo.com/path' },
      { kind: 'text', text: ' fim' },
    ]);
  });

  it('prefixa https em www.', () => {
    const s = parseLinkifiedPlainText('Site www.exemplo.com.br ok');
    expect(s[1]).toEqual({
      kind: 'url',
      text: 'www.exemplo.com.br',
      href: 'https://www.exemplo.com.br',
    });
  });

  it('não trata telefone dentro de URL', () => {
    const s = parseLinkifiedPlainText('Tel https://exemplo.com/tel/11999998888 fim');
    const urlSeg = s.find((x) => x.kind === 'url');
    expect(urlSeg?.kind).toBe('url');
    expect((urlSeg as { text: string }).text).toContain('exemplo.com');
  });

  it('detecta telefone com parênteses e espaços', () => {
    const s = parseLinkifiedPlainText('Ligue (11) 98765-4321 hoje');
    expect(s[1]).toMatchObject({
      kind: 'phone',
      text: '(11) 98765-4321',
      telHref: 'tel:11987654321',
    });
  });
});
