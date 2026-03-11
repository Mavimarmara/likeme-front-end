import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { ApiResponse } from '@/types/infrastructure';

export interface User {
  id: string;
  username?: string | null;
  email?: string;
  name?: string;
  picture?: string;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  personId?: string;
}

/** Contato da pessoa (email, phone, shipping_address, etc.) */
export interface PersonContact {
  id: string;
  type: string;
  value: string;
}

/** Pessoa com contatos (retornada no perfil) */
export interface PersonWithContacts {
  id: string;
  firstName: string;
  lastName?: string | null;
  surname?: string | null;
  contacts?: PersonContact[];
  /** Dados do formulário de registro (quando retornados pelo perfil) */
  birthdate?: string | null;
  gender?: string | null;
  weight?: string | null;
  height?: string | null;
  insurance?: string | null;
}

/** Perfil completo retornado por GET /api/auth/profile */
export interface UserProfile extends User {
  person?: PersonWithContacts | null;
}

export type GetProfileResponse = ApiResponse<UserProfile>;

/** Endereço de entrega no formato retornado pelo perfil (contact type shipping_address) */
export interface ShippingAddressFromProfile {
  fullName: string;
  addressLine1: string;
  streetNumber: string;
  addressLine2: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

class UserService {
  /**
   * Busca o perfil do usuário autenticado
   */
  async getProfile(): Promise<GetProfileResponse> {
    try {
      const response = await apiClient.get<GetProfileResponse>('/api/auth/profile', undefined, true, false);

      logger.debug('User profile response:', {
        success: response.success,
        hasData: !!response.data,
        userId: response.data?.id,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Busca o endereço de entrega cadastrado do usuário (contact type shipping_address no perfil).
   * Retorna null se não houver endereço cadastrado.
   */
  async getShippingAddress(): Promise<ShippingAddressFromProfile | null> {
    const response = await this.getProfile();
    if (!response.success || !response.data?.person?.contacts?.length) {
      return null;
    }
    const contact = response.data.person.contacts.find((c) => c.type === 'shipping_address');
    if (!contact?.value) {
      return null;
    }
    try {
      const parsed = JSON.parse(contact.value) as Record<string, unknown>;
      if (typeof parsed !== 'object' || parsed === null) return null;
      return {
        fullName: String(parsed.fullName ?? ''),
        addressLine1: String(parsed.addressLine1 ?? ''),
        streetNumber: String(parsed.streetNumber ?? ''),
        addressLine2: String(parsed.addressLine2 ?? ''),
        neighborhood: String(parsed.neighborhood ?? ''),
        city: String(parsed.city ?? ''),
        state: String(parsed.state ?? ''),
        zipCode: String(parsed.zipCode ?? ''),
        phone: String(parsed.phone ?? ''),
      };
    } catch {
      return null;
    }
  }

  /**
   * Salva o endereço de entrega do usuário (cria ou atualiza o contato shipping_address).
   */
  async saveShippingAddress(address: ShippingAddressFromProfile): Promise<GetProfileResponse> {
    const normalized = {
      ...address,
      fullName: (address.fullName || '').trim(),
      addressLine1: (address.addressLine1 || '').trim(),
      streetNumber: (address.streetNumber || '').trim(),
      addressLine2: (address.addressLine2 || '').trim(),
      neighborhood: (address.neighborhood || '').trim(),
      city: (address.city || '').trim(),
      state: (address.state || '').trim().slice(0, 2).toUpperCase(),
      zipCode: (address.zipCode || '').replace(/\D/g, '').slice(0, 8),
      phone: (address.phone || '').trim(),
    };
    if (normalized.zipCode.length < 8) {
      throw new Error('CEP deve ter 8 dígitos.');
    }
    if (normalized.phone.length < 10) {
      throw new Error('Telefone inválido.');
    }
    const response = await apiClient.put<GetProfileResponse>('/api/auth/profile/shipping-address', normalized, true);
    if (response && (response as any).success) {
      return response as GetProfileResponse;
    }
    throw new Error((response as any)?.message || 'Erro ao salvar endereço');
  }
}

export default new UserService();
