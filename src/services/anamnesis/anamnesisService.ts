import apiClient from '../infrastructure/apiClient';
import userService from '../user/userService';
import { logger } from '@/utils/logger';
import type {
  AnamnesisQuestion,
  CreateUserAnswerData,
  UserAnswer,
  GetAnamnesisQuestionsResponse,
  GetAnamnesisQuestionResponse,
  GetCompleteAnamnesisResponse,
  CreateUserAnswerResponse,
  GetUserAnswersResponse,
  GetUserAnswerResponse,
  GetAnamnesisQuestionsParams,
  GetAnamnesisQuestionParams,
  GetCompleteAnamnesisParams,
  GetUserAnswersParams,
  GetUserAnswerParams,
  GetUserScoresResponse,
  GetUserScoresParams,
  GetUserMarkersResponse,
  GetUserMarkersParams,
} from '@/types/anamnesis';

class AnamnesisService {
  private readonly anamnesisEndpoint = '/api/anamnesis';

  async getQuestions(params: GetAnamnesisQuestionsParams): Promise<GetAnamnesisQuestionsResponse> {
    try {
      if (!params.locale) {
        throw new Error('Locale is required');
      }

      const queryParams: Record<string, string> = {
        locale: params.locale,
      };

      if (params.keyPrefix) {
        queryParams.keyPrefix = params.keyPrefix;
      }

      const response = await apiClient.get<GetAnamnesisQuestionsResponse>(
        `${this.anamnesisEndpoint}/questions`,
        queryParams,
        true,
        false,
      );

      logger.debug('Anamnesis questions response:', {
        locale: params.locale,
        success: response.success,
        questionsCount: response.data?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching anamnesis questions:', error);
      throw error;
    }
  }

  async getQuestionByKey(params: GetAnamnesisQuestionParams): Promise<GetAnamnesisQuestionResponse> {
    try {
      if (!params.key || !params.locale) {
        throw new Error('Key and locale are required');
      }

      const response = await apiClient.get<GetAnamnesisQuestionResponse>(
        `${this.anamnesisEndpoint}/questions/${params.key}`,
        { locale: params.locale },
        true,
        false,
      );

      logger.debug('Anamnesis question response:', {
        key: params.key,
        locale: params.locale,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching anamnesis question:', error);
      throw error;
    }
  }

  async getCompleteAnamnesis(params: GetCompleteAnamnesisParams): Promise<GetCompleteAnamnesisResponse> {
    try {
      if (!params.locale) {
        throw new Error('Locale is required');
      }

      const response = await apiClient.get<GetCompleteAnamnesisResponse>(
        `${this.anamnesisEndpoint}/complete`,
        { locale: params.locale },
        true,
        false,
      );

      logger.debug('Complete anamnesis response:', {
        locale: params.locale,
        success: response.success,
        questionsCount: response.data?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching complete anamnesis:', error);
      throw error;
    }
  }

  async createOrUpdateAnswer(data: CreateUserAnswerData): Promise<CreateUserAnswerResponse> {
    try {
      if (!data.userId || !data.questionConceptId) {
        throw new Error('userId and questionConceptId are required');
      }

      const response = await apiClient.post<CreateUserAnswerResponse>(`${this.anamnesisEndpoint}/answers`, data, true);

      logger.debug('User answer created/updated:', {
        userId: data.userId,
        questionConceptId: data.questionConceptId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error creating/updating user answer:', error);
      throw error;
    }
  }

  async getUserAnswers(params: GetUserAnswersParams): Promise<GetUserAnswersResponse> {
    try {
      if (!params.userId) {
        throw new Error('userId is required');
      }

      const queryParams: Record<string, string> = {};
      if (params.locale) {
        queryParams.locale = params.locale;
      }

      const response = await apiClient.get<GetUserAnswersResponse>(
        `${this.anamnesisEndpoint}/answers/user/${params.userId}`,
        queryParams,
        true,
        false,
      );

      logger.debug('User answers response:', {
        userId: params.userId,
        locale: params.locale,
        success: response.success,
        answersCount: response.data?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching user answers:', error);
      throw error;
    }
  }

  async getUserAnswer(params: GetUserAnswerParams): Promise<GetUserAnswerResponse> {
    try {
      if (!params.userId || !params.questionConceptId) {
        throw new Error('userId and questionConceptId are required');
      }

      const response = await apiClient.get<GetUserAnswerResponse>(
        `${this.anamnesisEndpoint}/answers/user/${params.userId}/question/${params.questionConceptId}`,
        undefined,
        true,
        false,
      );

      logger.debug('User answer response:', {
        userId: params.userId,
        questionConceptId: params.questionConceptId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching user answer:', error);
      throw error;
    }
  }

  async getUserScores(params: GetUserScoresParams): Promise<GetUserScoresResponse> {
    try {
      if (!params.userId) {
        throw new Error('userId is required');
      }

      const response = await apiClient.get<GetUserScoresResponse>(
        `${this.anamnesisEndpoint}/scores/user/${params.userId}`,
        undefined,
        true,
        false,
      );

      logger.debug('User scores response:', {
        userId: params.userId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching user scores:', error);
      throw error;
    }
  }

  async getUserMarkers(params: GetUserMarkersParams): Promise<GetUserMarkersResponse> {
    try {
      if (!params.userId) {
        throw new Error('userId is required');
      }

      const response = await apiClient.get<GetUserMarkersResponse>(
        `${this.anamnesisEndpoint}/markers/user/${params.userId}`,
        undefined,
        true,
        false,
      );

      logger.debug('User markers response:', {
        userId: params.userId,
        success: response.success,
        markersCount: response.data?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching user markers:', error);
      throw error;
    }
  }

  /** Mapeamento de aliases para unificar keys em português e inglês. */
  private static readonly KEY_PREFIX_ALIASES: Record<string, string[]> = {
    habits_movimento: ['habits_movimento', 'habits_activity'],
    habits_espiritualidade: ['habits_espiritualidade', 'habits_spirituality'],
    habits_sono: ['habits_sono', 'habits_sleep'],
    habits_nutricao: ['habits_nutricao', 'habits_nutrition'],
    habits_estresse: ['habits_estresse', 'habits_stress'],
    habits_autoestima: ['habits_autoestima', 'habits_self-esteem'],
    habits_relacionamentos: ['habits_relacionamentos', 'habits_connection'],
    habits_saude_bucal: ['habits_saude_bucal', 'habits_smile'],
    habits_proposito: ['habits_proposito', 'habits_purpose-vision'],
  };

  /** Seções consideradas para anamnese completa (mesmo critério de useAnamnesisProgress). */
  private static readonly COMPLETION_SECTIONS: Array<{ prefix: string; name: string }> = [
    { prefix: 'mental', name: 'Mente' },
    { prefix: 'physical', name: 'Corpo' },
    { prefix: 'habits_movimento', name: 'Movimento' },
    { prefix: 'habits_espiritualidade', name: 'Espiritualidade' },
    { prefix: 'habits_sono', name: 'Sono' },
    { prefix: 'habits_nutricao', name: 'Alimentação' },
    { prefix: 'habits_estresse', name: 'Estresse' },
    { prefix: 'habits_autoestima', name: 'Autoestima' },
    { prefix: 'habits_relacionamentos', name: 'Relacionamentos' },
    { prefix: 'habits_saude_bucal', name: 'Saúde bucal' },
    { prefix: 'habits_proposito', name: 'Propósito' },
  ];

  /**
   * Verifica se todas as seções da anamnese (Mente, Corpo e Hábitos) estão respondidas.
   * Usado antes de permitir finalizar a anamnese.
   */
  async getCompletionStatus(): Promise<{
    allSectionsComplete: boolean;
    incompleteSections: Array<{
      sectionKey: string;
      sectionName: string;
      total: number;
      answered: number;
    }>;
  }> {
    const profileResponse = await userService.getProfile();
    const userId = profileResponse.success ? profileResponse.data?.id : null;
    if (!userId) {
      throw new Error('Usuário não identificado');
    }

    const [questionsRes, answersRes] = await Promise.all([
      this.getQuestions({ locale: 'pt-BR' }),
      this.getUserAnswers({ userId }),
    ]);

    const allQuestions = questionsRes.data ?? [];
    const answers = answersRes.data ?? [];
    const answeredIds = new Set(answers.map((a) => a.questionConceptId));

    const incompleteSections: Array<{
      sectionKey: string;
      sectionName: string;
      total: number;
      answered: number;
    }> = [];

    for (const { prefix, name } of AnamnesisService.COMPLETION_SECTIONS) {
      // Usa aliases para buscar tanto português quanto inglês
      const prefixes = AnamnesisService.KEY_PREFIX_ALIASES[prefix] || [prefix];
      const sectionQuestions = allQuestions.filter((q) => prefixes.some((p) => q.key.startsWith(p)));
      const total = sectionQuestions.length;
      if (total === 0) {
        continue;
      }
      const answered = sectionQuestions.filter((q) => answeredIds.has(q.id)).length;
      if (answered < total) {
        incompleteSections.push({
          sectionKey: prefix,
          sectionName: name,
          total,
          answered,
        });
      }
    }

    return {
      allSectionsComplete: incompleteSections.length === 0,
      incompleteSections,
    };
  }
}

export default new AnamnesisService();
