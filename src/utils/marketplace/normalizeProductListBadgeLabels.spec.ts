import { normalizeProductListBadgeLabels } from './normalizeProductListBadgeLabels';

describe('normalizeProductListBadgeLabels', () => {
  const translate = (key: string) =>
    ({
      'marketplace.productMode.online': 'Online',
      'marketplace.productMode.onsite': 'Presencial',
    }[key] ?? key);

  it('traduz tags de modalidade independentemente de capitalização', () => {
    expect(normalizeProductListBadgeLabels(['online', 'Onsite', 'ONSITE'], translate)).toEqual([
      'Online',
      'Presencial',
      'Presencial',
    ]);
  });

  it('preserva tags que não são modalidade', () => {
    expect(normalizeProductListBadgeLabels(['Sono', ' online '], translate)).toEqual(['Sono', 'Online']);
  });
});
