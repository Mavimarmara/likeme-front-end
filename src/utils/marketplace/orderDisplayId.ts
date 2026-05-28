export function formatOrderDisplayId(orderId: string, maxLength = 10): string {
  return `#${orderId.replace(/-/g, '').slice(0, maxLength).toUpperCase()}`;
}
