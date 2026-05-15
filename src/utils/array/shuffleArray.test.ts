import { pickRandomItems, shuffleArray } from '@/utils/array/shuffleArray';

describe('shuffleArray', () => {
  it('mantém os mesmos elementos', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffleArray(input);
    expect(output.sort()).toEqual(input.sort());
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('pickRandomItems', () => {
  it('retorna no máximo count itens', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    expect(pickRandomItems(input, 3)).toHaveLength(3);
    expect(pickRandomItems(input, 10)).toHaveLength(5);
  });

  it('retorna vazio quando count é zero', () => {
    expect(pickRandomItems(['a'], 0)).toEqual([]);
  });
});
