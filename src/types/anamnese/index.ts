import type { ApiResponse } from '@/types/infrastructure';

/**
 * Tipo de pergunta da anamnese
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
 * Pergunta da anamnese
 */
export interface AnamneseQuestion {
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
export interface GetAnamneseQuestionsResponse extends ApiResponse<AnamneseQuestion[]> {}

/**
 * Resposta da API para uma pergunta específica
 */
export interface GetAnamneseQuestionResponse extends ApiResponse<AnamneseQuestion> {}

/**
 * Resposta da API para anamnese completa
 */
export interface GetCompleteAnamneseResponse extends ApiResponse<any[]> {}

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
export interface GetAnamneseQuestionsParams {
  locale: string;
}

/**
 * Parâmetros para buscar uma pergunta específica
 */
export interface GetAnamneseQuestionParams {
  key: string;
  locale: string;
}

/**
 * Parâmetros para buscar anamnese completa
 */
export interface GetCompleteAnamneseParams {
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

