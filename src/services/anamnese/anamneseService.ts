import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  AnamneseQuestion,
  CreateUserAnswerData,
  UserAnswer,
  GetAnamneseQuestionsResponse,
  GetAnamneseQuestionResponse,
  GetCompleteAnamneseResponse,
  CreateUserAnswerResponse,
  GetUserAnswersResponse,
  GetUserAnswerResponse,
  GetAnamneseQuestionsParams,
  GetAnamneseQuestionParams,
  GetCompleteAnamneseParams,
  GetUserAnswersParams,
  GetUserAnswerParams,
} from '@/types/anamnese';

class AnamneseService {
  private readonly anamneseEndpoint = '/api/anamnese';

  /**
   * Busca todas as perguntas da anamnese com traduções
   */
  async getQuestions(params: GetAnamneseQuestionsParams): Promise<GetAnamneseQuestionsResponse> {
    try {
      if (!params.locale) {
        throw new Error('Locale is required');
      }

      const response = await apiClient.get<GetAnamneseQuestionsResponse>(
        `${this.anamneseEndpoint}/questions`,
        { locale: params.locale },
        true,
        false
      );

      logger.debug('Anamnese questions response:', {
        locale: params.locale,
        success: response.success,
        questionsCount: response.data?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching anamnese questions:', error);
      throw error;
    }
  }

  /**
   * Busca uma pergunta específica por key
   */
  async getQuestionByKey(params: GetAnamneseQuestionParams): Promise<GetAnamneseQuestionResponse> {
    try {
      if (!params.key || !params.locale) {
        throw new Error('Key and locale are required');
      }

      const response = await apiClient.get<GetAnamneseQuestionResponse>(
        `${this.anamneseEndpoint}/questions/${params.key}`,
        { locale: params.locale },
        true,
        false
      );

      logger.debug('Anamnese question response:', {
        key: params.key,
        locale: params.locale,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching anamnese question:', error);
      throw error;
    }
  }

  /**
   * Busca anamnese completa com todas as perguntas, textos e opções traduzidas
   */
  async getCompleteAnamnese(params: GetCompleteAnamneseParams): Promise<GetCompleteAnamneseResponse> {
    try {
      if (!params.locale) {
        throw new Error('Locale is required');
      }

      const response = await apiClient.get<GetCompleteAnamneseResponse>(
        `${this.anamneseEndpoint}/complete`,
        { locale: params.locale },
        true,
        false
      );

      logger.debug('Complete anamnese response:', {
        locale: params.locale,
        success: response.success,
        questionsCount: response.data?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching complete anamnese:', error);
      throw error;
    }
  }

  /**
   * Cria ou atualiza uma resposta do usuário
   */
  async createOrUpdateAnswer(data: CreateUserAnswerData): Promise<CreateUserAnswerResponse> {
    try {
      if (!data.userId || !data.questionConceptId) {
        throw new Error('userId and questionConceptId are required');
      }

      const response = await apiClient.post<CreateUserAnswerResponse>(
        `${this.anamneseEndpoint}/answers`,
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

  /**
   * Busca todas as respostas de um usuário
   */
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
        `${this.anamneseEndpoint}/answers/user/${params.userId}`,
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

  /**
   * Busca uma resposta específica do usuário para uma pergunta
   */
  async getUserAnswer(params: GetUserAnswerParams): Promise<GetUserAnswerResponse> {
    try {
      if (!params.userId || !params.questionConceptId) {
        throw new Error('userId and questionConceptId are required');
      }

      const response = await apiClient.get<GetUserAnswerResponse>(
        `${this.anamneseEndpoint}/answers/user/${params.userId}/question/${params.questionConceptId}`,
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
}

export default new AnamneseService();

