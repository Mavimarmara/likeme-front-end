import {
  extractStreetNumber,
  extractComplement,
  extractStreet,
  formatAddress,
  formatBillingAddress,
  type AddressData,
} from './addressFormatter';

describe('addressFormatter', () => {
  describe('extractStreetNumber', () => {
    it('should extract street number from address line', () => {
      expect(extractStreetNumber('Rua Marselha, 1029')).toBe('1029');
      expect(extractStreetNumber('Av. Paulista, 1000')).toBe('1000');
      expect(extractStreetNumber('Rua Test, 42')).toBe('42');
    });

    it('should return empty string if no number found', () => {
      expect(extractStreetNumber('Rua Marselha')).toBe('');
      expect(extractStreetNumber('')).toBe('');
    });

    it('should handle addresses with complement', () => {
      expect(extractStreetNumber('Rua Marselha, 1029 - Apto 94')).toBe('1029');
    });
  });

  describe('extractComplement', () => {
    it('should extract complement from address line', () => {
      expect(extractComplement('Rua Marselha, 1029 - Apto 94')).toBe('Apto 94');
      expect(extractComplement('Av. Paulista, 1000 - Sala 10')).toBe('Sala 10');
      expect(extractComplement('Rua Test, 42 - Bloco A')).toBe('Bloco A');
    });

    it('should return empty string if no complement found', () => {
      expect(extractComplement('Rua Marselha, 1029')).toBe('');
      expect(extractComplement('Rua Marselha')).toBe('');
      expect(extractComplement('')).toBe('');
    });

    it('should handle multiple words in complement', () => {
      expect(extractComplement('Rua Test, 42 - Apto 101 Bloco B')).toBe('Apto 101 Bloco B');
    });
  });

  describe('extractStreet', () => {
    it('should extract street name from address line', () => {
      expect(extractStreet('Rua Marselha, 1029')).toBe('Rua Marselha');
      expect(extractStreet('Av. Paulista, 1000')).toBe('Av. Paulista');
      expect(extractStreet('Rua Test, 42')).toBe('Rua Test');
    });

    it('should remove number and complement', () => {
      expect(extractStreet('Rua Marselha, 1029 - Apto 94')).toBe('Rua Marselha');
      expect(extractStreet('Av. Paulista, 1000 - Sala 10')).toBe('Av. Paulista');
    });

    it('should handle address without number', () => {
      expect(extractStreet('Rua Marselha')).toBe('Rua Marselha');
    });
  });

  describe('formatAddress', () => {
    it('should format address as string', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Marselha, 1029',
        addressLine2: '',
        neighborhood: 'Jaguaré',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05332-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatAddress(address);
      expect(result).toBe('Rua Marselha, 1029, Jaguaré, São Paulo, SP, 05332-000');
    });

    it('should filter out empty parts', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Marselha, 1029',
        addressLine2: '',
        neighborhood: '',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05332-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatAddress(address);
      expect(result).toBe('Rua Marselha, 1029, São Paulo, SP, 05332-000');
    });

    it('should include addressLine2 if provided', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Marselha, 1029',
        addressLine2: 'Apto 94',
        neighborhood: 'Jaguaré',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05332-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatAddress(address);
      expect(result).toBe('Rua Marselha, 1029, Apto 94, Jaguaré, São Paulo, SP, 05332-000');
    });
  });

  describe('formatBillingAddress', () => {
    it('should format billing address correctly', () => {
      const address: AddressData = {
        fullName: 'Ana Paula do Amaral',
        addressLine1: 'Rua Marselha, 1029 - Apto 94',
        addressLine2: '',
        neighborhood: 'Jaguaré',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05332-000',
        phone: '+55 11 97979-2016',
      };

      const result = formatBillingAddress(address);

      expect(result).toEqual({
        country: 'br',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Jaguaré',
        street: 'Rua Marselha',
        streetNumber: '1029',
        zipcode: '05332000',
        complement: 'Apto 94',
      });
    });

    it('should extract street number correctly', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Av. Paulista, 1000',
        addressLine2: '',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        phone: '+55 11 99999-9999',
      };

      const result = formatBillingAddress(address);
      expect(result.streetNumber).toBe('1000');
    });

    it('should extract complement from addressLine1', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Test, 42 - Sala 10',
        addressLine2: '',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatBillingAddress(address);
      expect(result.complement).toBe('Sala 10');
    });

    it('should use addressLine2 as complement if no complement in addressLine1', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Test, 42',
        addressLine2: 'Apto 101',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatBillingAddress(address);
      expect(result.complement).toBe('Apto 101');
    });

    it('should remove formatting from zipcode', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Test, 42',
        addressLine2: '',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05332-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatBillingAddress(address);
      expect(result.zipcode).toBe('05332000');
    });

    it('should set complement as undefined if empty', () => {
      const address: AddressData = {
        fullName: 'John Doe',
        addressLine1: 'Rua Test, 42',
        addressLine2: '',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        phone: '+55 11 99999-9999',
      };

      const result = formatBillingAddress(address);
      expect(result.complement).toBeUndefined();
    });
  });
});

