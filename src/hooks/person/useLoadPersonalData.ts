import { useCallback } from 'react';
import { userService, personsService } from '@/services';
import type { PersonWithContacts } from '@/services/user/userService';
import type { PersonResponse } from '@/types/person';
import { isoToBirthdateMask } from '@/utils/formatters/personFormats';

/** Dados da pessoa no formato do formulário de registro (para preencher campos). */
export interface PersonFormData {
  fullName: string;
  birthdate: string;
  gender: string;
  weight: string;
  height: string;
}

/** Converte valor de peso/altura da API (number ou string) para string do formulário (vírgula decimal). */
function toFormNumber(value: unknown): string {
  if (value === undefined || value === null) return '';
  const s = typeof value === 'number' ? String(value) : String(value).trim();
  if (s === '') return '';
  return s.replace('.', ',');
}

function mapPersonToFormData(person: PersonWithContacts | PersonResponse): PersonFormData {
  const nameParts = [person.firstName, person.lastName].filter(Boolean) as string[];
  const fullName = nameParts.join(' ');

  const birthdate =
    person.birthdate != null && String(person.birthdate).trim()
      ? isoToBirthdateMask(String(person.birthdate).trim())
      : '';

  const gender =
    person.gender !== undefined && person.gender !== null && String(person.gender).trim()
      ? String(person.gender).trim()
      : '';

  const weight = toFormNumber(person.weight);
  const height = toFormNumber(person.height);

  return { fullName, birthdate, gender, weight, height };
}

/**
 * Hook do domínio person: carrega dados do perfil para preencher o formulário de registro.
 * Usa GET /api/auth/profile; se gender, peso ou altura não vierem no perfil, busca a pessoa
 * completa com GET /api/persons/:id.
 */
export function useLoadPersonalData() {
  const loadPersonalData = useCallback(async (): Promise<PersonFormData | null> => {
    try {
      const response = await userService.getProfile();
      if (!response.success || !response.data?.person) return null;

      const profilePerson = response.data.person;
      let formData = mapPersonToFormData(profilePerson);

      const missingFields = !formData.gender.trim() || !formData.weight.trim() || !formData.height.trim();
      if (missingFields && profilePerson.id) {
        const fullPerson = await personsService.getPerson(profilePerson.id);
        if (fullPerson) {
          formData = mapPersonToFormData(fullPerson);
        }
      }

      return formData;
    } catch {
      return null;
    }
  }, []);

  return { loadPersonalData };
}
