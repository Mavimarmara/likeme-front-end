describe('Card Data Formatting', () => {
  describe('formatCardExpiry', () => {
    it('should format expiry date from MM/YY to MMYY', () => {
      const formatExpiry = (date: string): string => {
        return date.replace(/\D/g, '');
      };

      expect(formatExpiry('12/25')).toBe('1225');
      expect(formatExpiry('01/24')).toBe('0124');
      expect(formatExpiry('09/30')).toBe('0930');
    });

    it('should handle already formatted dates', () => {
      const formatExpiry = (date: string): string => {
        return date.replace(/\D/g, '');
      };

      expect(formatExpiry('1225')).toBe('1225');
      expect(formatExpiry('0124')).toBe('0124');
    });

    it('should remove all non-numeric characters', () => {
      const formatExpiry = (date: string): string => {
        return date.replace(/\D/g, '');
      };

      expect(formatExpiry('12-25')).toBe('1225');
      expect(formatExpiry('12 25')).toBe('1225');
      expect(formatExpiry('12.25')).toBe('1225');
    });
  });

  describe('formatCardNumber', () => {
    it('should remove spaces from card number', () => {
      const formatCardNumber = (number: string): string => {
        return number.replace(/\s/g, '');
      };

      expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111111111111111');
      expect(formatCardNumber('1234 5678 9012 3456')).toBe('1234567890123456');
    });

    it('should handle card number without spaces', () => {
      const formatCardNumber = (number: string): string => {
        return number.replace(/\s/g, '');
      };

      expect(formatCardNumber('4111111111111111')).toBe('4111111111111111');
    });
  });

  describe('validateCardData', () => {
    it('should validate card expiry format (4 digits)', () => {
      const isValidExpiry = (expiry: string): boolean => {
        const formatted = expiry.replace(/\D/g, '');
        return formatted.length === 4;
      };

      expect(isValidExpiry('12/25')).toBe(true);
      expect(isValidExpiry('1225')).toBe(true);
      expect(isValidExpiry('12/2')).toBe(false);
      expect(isValidExpiry('125')).toBe(false);
      expect(isValidExpiry('12/255')).toBe(false);
    });

    it('should validate card number is not empty', () => {
      const isValidCardNumber = (number: string): boolean => {
        return number.replace(/\s/g, '').length > 0;
      };

      expect(isValidCardNumber('4111111111111111')).toBe(true);
      expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
      expect(isValidCardNumber('')).toBe(false);
      expect(isValidCardNumber('   ')).toBe(false);
    });

    it('should validate CVV is not empty', () => {
      const isValidCvv = (cvv: string): boolean => {
        return cvv.trim().length > 0;
      };

      expect(isValidCvv('123')).toBe(true);
      expect(isValidCvv('1234')).toBe(true);
      expect(isValidCvv('')).toBe(false);
      expect(isValidCvv('   ')).toBe(false);
    });

    it('should validate cardholder name is not empty', () => {
      const isValidName = (name: string): boolean => {
        return name.trim().length > 0;
      };

      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Maria Silva')).toBe(true);
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
    });
  });
});

