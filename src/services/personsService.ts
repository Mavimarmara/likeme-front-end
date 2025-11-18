import apiClient from './apiClient';

export interface PersonData {
  firstName: string;
  lastName: string;
  surname?: string;
  nationalRegistration?: string;
  birthdate?: string;
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  insurance?: string;
}

export interface PersonResponse {
  id: string;
  firstName: string;
  lastName: string;
  surname?: string;
  nationalRegistration?: string;
  birthdate?: string;
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  insurance?: string;
  createdAt: string;
  updatedAt: string;
}

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

