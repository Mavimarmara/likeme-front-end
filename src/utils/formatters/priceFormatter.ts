import i18n from '@/i18n';

const MARKETPLACE_NO_PRICE_LABEL_KEY = 'marketplace.noPriceLabel';

export class PriceFormatter {
  private readonly value: number;

  constructor(price: number | null | undefined) {
    this.value = this.normalizePrice(price);
  }

  private normalizePrice(price: number | null | undefined): number {
    if (price === null || price === undefined || isNaN(Number(price))) {
      return 0;
    }
    return typeof price === 'number' ? price : parseFloat(String(price)) || 0;
  }

  toUSD(): string {
    return `$${this.value.toFixed(2)}`;
  }

  toBRL(): string {
    return `R$${this.value.toFixed(2)}`;
  }

  format(currency: 'USD' | 'BRL' = 'USD'): string {
    return currency === 'BRL' ? this.toBRL() : this.toUSD();
  }

  getValue(): number {
    return this.value;
  }

  isValid(): boolean {
    return this.value > 0;
  }
}

export const formatPrice = (price: number | null | undefined, currency: 'USD' | 'BRL' = 'BRL'): string => {
  return new PriceFormatter(price).format(currency);
};

/** Quando `price` é null/undefined, usa `i18n.t('marketplace.noPriceLabel')`; caso contrário, formata o valor. */
export const formatPriceLabel = (price: number | null | undefined, currency: 'USD' | 'BRL' = 'BRL'): string => {
  if (price === null || price === undefined) {
    return i18n.t(MARKETPLACE_NO_PRICE_LABEL_KEY);
  }
  return formatPrice(price, currency);
};
