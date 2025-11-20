import apiClient from '../infrastructure/apiClient';
import type { PersonData, PersonResponse } from '@/types/person';

class PersonsService {
  /**
   * Cria ou atualiza uma pessoa
   * Se a pessoa já existir (baseado no token do usuário), atualiza os dados
   * Caso contrário, cria uma nova pessoa
   */
  async createOrUpdatePerson(data: PersonData): Promise<PersonResponse> {
    return apiClient.post<PersonResponse>('/api/persons', data);
  }
}

export default new PersonsService();

