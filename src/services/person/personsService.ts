import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
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
      if (!response?.success || !response.data) {
        logger.warn('[personsService.getPerson] resposta sem dados da pessoa', {
          personId: id,
          success: response?.success,
        });
        return null;
      }
      return response.data;
    } catch (error) {
      logger.error('[personsService.getPerson] falha ao buscar pessoa', { personId: id, cause: error });
      return null;
    }
  }
}

export default new PersonsService();
