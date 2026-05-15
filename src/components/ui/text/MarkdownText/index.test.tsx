import React from 'react';
import { render } from '@testing-library/react-native';
import { MarkdownText } from '@/components/ui/text/MarkdownText';

describe('MarkdownText', () => {
  it('renderiza texto simples', () => {
    const { getByText } = render(<MarkdownText text='Descrição do produto' />);
    expect(getByText('Descrição do produto')).toBeTruthy();
  });

  it('remove delimitadores de negrito', () => {
    const { getByText } = render(<MarkdownText text='Texto **em destaque** fim' />);
    expect(getByText('em destaque', { exact: false })).toBeTruthy();
    expect(getByText(/Texto.*fim/)).toBeTruthy();
  });

  it('renderiza itens de lista', () => {
    const { getByText } = render(<MarkdownText text='- Primeiro\n- Segundo' />);
    expect(getByText(/Primeiro/)).toBeTruthy();
    expect(getByText(/Segundo/)).toBeTruthy();
  });

  it('renderiza parágrafos com linha em branco entre eles', () => {
    const { getByText } = render(<MarkdownText text='Parágrafo 1\n\nParágrafo 2' />);
    expect(getByText(/Parágrafo 1/)).toBeTruthy();
    expect(getByText(/Parágrafo 2/)).toBeTruthy();
  });
});
