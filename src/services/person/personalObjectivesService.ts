import apiClient from '../infrastructure/apiClient';
import { markerIdToObjectiveName } from '@/screens/auth/PersonalObjectivesScreen/useMarkers';
import { logger } from '@/utils/logger';
import {
  PersonalObjectivesResponse,
  PersonalObjectivesParams,
  PersonalObjective,
  MyObjectivesResponse,
} from '@/types/personalObjectives';
import type { ApiError } from '@/types/infrastructure';

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

  async addMyObjective(objectiveId: string): Promise<void> {
    await apiClient.post('/api/user-personal-objectives/me/objectives', { objectiveId }, true);
  }

  async saveMyObjectivesFromMarkerIds(markerIds: string[]): Promise<void> {
    if (markerIds.length === 0) {
      return;
    }

    const allObjectives = await this.getAllPersonalObjectives();
    const objectiveIdByName = new Map(allObjectives.map((objective) => [objective.name, objective.id]));

    const objectiveIds = new Set<string>();
    for (const markerId of markerIds) {
      const objectiveName = markerIdToObjectiveName(markerId);
      if (!objectiveName) {
        logger.warn('[personalObjectivesService] Marcador sem objetivo no catálogo', { markerId });
        continue;
      }
      const objectiveId = objectiveIdByName.get(objectiveName);
      if (!objectiveId) {
        logger.warn('[personalObjectivesService] Objetivo não encontrado na API', { objectiveName });
        continue;
      }
      objectiveIds.add(objectiveId);
    }

    if (objectiveIds.size === 0) {
      throw new Error('Nenhum objetivo válido para salvar');
    }

    for (const objectiveId of objectiveIds) {
      try {
        await this.addMyObjective(objectiveId);
      } catch (error) {
        const status = (error as ApiError).status;
        if (status === 409) {
          continue;
        }
        throw error;
      }
    }
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
