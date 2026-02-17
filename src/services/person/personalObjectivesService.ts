import apiClient from '../infrastructure/apiClient';
import {
  PersonalObjectivesResponse,
  PersonalObjectivesParams,
  PersonalObjective,
  MyObjectivesResponse,
} from '@/types/personalObjectives';

class PersonalObjectivesService {
  async getPersonalObjectives(params: PersonalObjectivesParams = {}): Promise<PersonalObjectivesResponse> {
    const { page = 1, limit = 10 } = params;

    return apiClient.get<PersonalObjectivesResponse>('/api/personal-objectives', { page, limit });
  }

  async getMySelectedObjectives(): Promise<PersonalObjective[]> {
    const response = await apiClient.get<MyObjectivesResponse>(
      '/api/user-personal-objectives/me/objectives',
      undefined,
      true,
    );
    return (response.data ?? []).map((uo) => uo.objective);
  }

  async getAllPersonalObjectives(): Promise<PersonalObjective[]> {
    const allObjectives: PersonalObjective[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getPersonalObjectives({
        page: currentPage,
        limit: 100,
      });

      allObjectives.push(...response.data.objectives);

      hasMore = currentPage < response.data.pagination.totalPages;
      currentPage += 1;
    }

    return allObjectives;
  }
}

export default new PersonalObjectivesService();
