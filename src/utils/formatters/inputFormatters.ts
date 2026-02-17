const MAX_CARD_NUMBER_LENGTH = 19;

export const formatCardNumber = (text: string): string => {
  const cleaned = text.replace(/\s/g, '');
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  return formatted.slice(0, MAX_CARD_NUMBER_LENGTH);
};

export const formatCpf = (text: string): string => {
  const numbers = text.replace(/\D/g, '');

  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export const formatExpiryDate = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

export const formatPhone = (text: string): string => {
  const numbers = text.replace(/\D/g, '');

  if (numbers.length <= 2) {
    return numbers.length > 0 ? `(${numbers}` : numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};
