import { useCallback } from 'react';
import { formatCardNumber, formatExpiryDate } from '@/utils/formatters';

export type FormattedInputType = 'cardNumber' | 'expiryDate';

interface UseFormattedInputOptions {
  type?: FormattedInputType;
  onChangeText: (text: string) => void;
}

/**
 * Hook para gerenciar formatação de inputs
 * @param options - Opções do hook incluindo tipo de formatação e callback
 * @returns Handler formatado para onChangeText
 */
export const useFormattedInput = ({ type, onChangeText }: UseFormattedInputOptions) => {
  const handleChange = useCallback((text: string) => {
    let formattedText = text;
    
    switch (type) {
      case 'cardNumber':
        formattedText = formatCardNumber(text);
        break;
      case 'expiryDate':
        formattedText = formatExpiryDate(text);
        break;
      default:
        formattedText = text;
    }
    
    onChangeText(formattedText);
  }, [type, onChangeText]);

  return handleChange;
};

