import apiClient from '../infrastructure/apiClient';
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
        false
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
        false
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
        false
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

      const response = await apiClient.post<CreateUserAnswerResponse>(
        `${this.anamnesisEndpoint}/answers`,
        data,
        true
      );

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
        false
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
        false
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
        false
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
}

export default new AnamnesisService();

