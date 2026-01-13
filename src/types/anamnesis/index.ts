import type { ApiResponse } from '@/types/infrastructure';

/**
 * Tipo de pergunta da anamnesis
 */
export type QuestionType = 'single_choice' | 'multiple_choice' | 'text' | 'number';

/**
 * Opção de resposta para uma pergunta
 */
export interface AnswerOption {
  id: string;
  key: string;
  order: number;
  text: string | null;
}

/**
 * Pergunta da anamnesis
 */
export interface AnamnesisQuestion {
  id: string;
  key: string;
  type: QuestionType;
  text: string | null;
  answerOptions: AnswerOption[];
}

/**
 * Dados para criar/atualizar resposta do usuário
 */
export interface CreateUserAnswerData {
  userId: string;
  questionConceptId: string;
  answerOptionId?: string | null;
  answerText?: string | null;
}

/**
 * Resposta do usuário
 */
export interface UserAnswer {
  id: string;
  userId: string;
  questionConceptId: string;
  questionKey: string;
  answerOptionId: string | null;
  answerOptionKey: string | null;
  answerText: string | null;
  createdAt: Date;
}

/**
 * Resposta da API para lista de perguntas
 */
export interface GetAnamnesisQuestionsResponse extends ApiResponse<AnamnesisQuestion[]> {}

/**
 * Resposta da API para uma pergunta específica
 */
export interface GetAnamnesisQuestionResponse extends ApiResponse<AnamnesisQuestion> {}

/**
 * Resposta da API para anamnesis completa
 */
export interface GetCompleteAnamnesisResponse extends ApiResponse<any[]> {}

/**
 * Resposta da API para criar/atualizar resposta
 */
export interface CreateUserAnswerResponse extends ApiResponse<any> {}

/**
 * Resposta da API para lista de respostas do usuário
 */
export interface GetUserAnswersResponse extends ApiResponse<UserAnswer[]> {}

/**
 * Resposta da API para uma resposta específica
 */
export interface GetUserAnswerResponse extends ApiResponse<UserAnswer> {}

/**
 * Parâmetros para buscar perguntas
 */
export interface GetAnamnesisQuestionsParams {
  locale: string;
}

/**
 * Parâmetros para buscar uma pergunta específica
 */
export interface GetAnamnesisQuestionParams {
  key: string;
  locale: string;
}

/**
 * Parâmetros para buscar anamnesis completa
 */
export interface GetCompleteAnamnesisParams {
  locale: string;
}

/**
 * Parâmetros para buscar respostas do usuário
 */
export interface GetUserAnswersParams {
  userId: string;
  locale?: string;
}

/**
 * Parâmetros para buscar uma resposta específica
 */
export interface GetUserAnswerParams {
  userId: string;
  questionConceptId: string;
}

