const MAX_CARD_NUMBER_LENGTH = 19;

export const formatCardNumber = (text: string): string => {
  const cleaned = text.replace(/\s/g, '');
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  return formatted.slice(0, MAX_CARD_NUMBER_LENGTH);
};

export const formatExpiryDate = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};
