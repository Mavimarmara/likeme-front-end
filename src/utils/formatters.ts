/**
 * Utility functions for formatting text input values
 */

const MAX_CARD_NUMBER_LENGTH = 19; // 16 digits + 3 spaces

/**
 * Formats a card number string by adding spaces every 4 digits
 * @param text - The raw card number string
 * @returns Formatted card number with spaces (e.g., "1234 5678 9101 1121")
 */
export const formatCardNumber = (text: string): string => {
  const cleaned = text.replace(/\s/g, '');
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  return formatted.slice(0, MAX_CARD_NUMBER_LENGTH);
};

/**
 * Formats an expiry date string by adding a slash after the month
 * @param text - The raw expiry date string
 * @returns Formatted expiry date (e.g., "12/34")
 */
export const formatExpiryDate = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

