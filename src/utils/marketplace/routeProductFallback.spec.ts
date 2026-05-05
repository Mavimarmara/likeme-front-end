import { buildApiProductFromRouteFallback } from './routeProductFallback';

describe('buildApiProductFromRouteFallback', () => {
  const fixedIso = '2024-01-15T12:00:00.000Z';

  it('mapeia preço em string com símbolo $ (ponto decimal)', () => {
    const result = buildApiProductFromRouteFallback(
      {
        id: 'p-1',
        title: 'Item',
        price: '$19.99',
        image: 'https://img.example/x.jpg',
        type: 'physical',
        description: 'Desc',
      },
      fixedIso,
    );

    expect(result).toMatchObject({
      id: 'p-1',
      name: 'Item',
      price: 19.99,
      image: 'https://img.example/x.jpg',
      type: 'physical',
      description: 'Desc',
      quantity: 0,
      status: 'active',
      createdAt: fixedIso,
      updatedAt: fixedIso,
    });
  });

  it('usa preço 0 quando o parse não é finito', () => {
    const result = buildApiProductFromRouteFallback(
      {
        id: 'p-2',
        title: 'Bad price',
        price: 'not-a-number',
        image: '',
      },
      fixedIso,
    );

    expect(result.price).toBe(0);
  });
});
