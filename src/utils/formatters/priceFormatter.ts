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

export const formatPrice = (price: number | null | undefined, currency: 'USD' | 'BRL' = 'USD'): string => {
  return new PriceFormatter(price).format(currency);
};
