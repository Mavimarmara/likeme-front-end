import apiClient from '../infrastructure/apiClient';
import type { ApiResponse } from '@/types/infrastructure';
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

  /**
   * Obtém uma pessoa pelo ID (ex.: para preencher formulário com dados completos).
   */
  async getPerson(id: string): Promise<PersonResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<PersonResponse>>(`/api/persons/${id}`, undefined, true, false);
      return response?.data ?? null;
    } catch {
      return null;
    }
  }
}

export default new PersonsService();
