import type { BillingAddress } from '@/types/order';

export interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

/**
 * Extrai o número da rua de uma linha de endereço
 * Ex: "Rua Marselha, 1029" -> "1029"
 */
export const extractStreetNumber = (addressLine: string): string => {
  const match = addressLine.match(/,\s*(\d+)/);
  return match ? match[1] : '';
};

/**
 * Extrai o complemento de uma linha de endereço
 * Ex: "Rua Marselha, 1029 - Apto 94" -> "Apto 94"
 */
export const extractComplement = (addressLine: string): string => {
  const match = addressLine.match(/-\s*(.+)/);
  return match ? match[1].trim() : '';
};

/**
 * Extrai o nome da rua de uma linha de endereço
 * Ex: "Rua Marselha, 1029 - Apto 94" -> "Rua Marselha"
 */
export const extractStreet = (addressLine: string): string => {
  let street = addressLine.replace(/-\s*.*/, '').trim();
  street = street.replace(/,\s*\d+.*/, '').trim();
  return street;
};

/**
 * Formata um endereço como string
 */
export const formatAddress = (address: AddressData): string => {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.neighborhood,
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean);
  return parts.join(', ');
};

/**
 * Converte AddressData em BillingAddress estruturado
 */
export const formatBillingAddress = (address: AddressData): BillingAddress => {
  const street = extractStreet(address.addressLine1);
  const streetNumber = extractStreetNumber(address.addressLine1);
  const complement = extractComplement(address.addressLine1) || address.addressLine2 || '';

  return {
    country: 'br',
    state: address.state,
    city: address.city,
    neighborhood: address.neighborhood,
    street: street,
    streetNumber: streetNumber,
    zipcode: address.zipCode.replace(/\D/g, ''), // Remove formatação do CEP
    complement: complement || undefined,
  };
};
