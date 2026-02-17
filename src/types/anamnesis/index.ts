import type { ApiResponse } from '@/types/infrastructure';

/**
 * Domínio da pergunta (área da anamnese)
 */
export type AnamnesisDomain =
  | 'body'
  | 'mind'
  | 'habits'
  | 'movement'
  | 'sleep'
  | 'nutrition'
  | 'stress'
  | 'spirituality'
  | 'unknown';

/**
 * Tipo de resposta da pergunta
 */
export type AnamnesisAnswerType = 'single_choice' | 'multiple_choice' | 'text' | 'number';

export type QuestionType = AnamnesisAnswerType;

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
  domain: AnamnesisDomain;
  answerType: AnamnesisAnswerType;
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
export type GetAnamnesisQuestionsResponse = ApiResponse<AnamnesisQuestion[]>;

/**
 * Resposta da API para uma pergunta específica
 */
export type GetAnamnesisQuestionResponse = ApiResponse<AnamnesisQuestion>;

/**
 * Resposta da API para anamnesis completa
 */
export type GetCompleteAnamnesisResponse = ApiResponse<any[]>;

/**
 * Resposta da API para criar/atualizar resposta
 */
export type CreateUserAnswerResponse = ApiResponse<any>;

/**
 * Resposta da API para lista de respostas do usuário
 */
export type GetUserAnswersResponse = ApiResponse<UserAnswer[]>;

/**
 * Resposta da API para uma resposta específica
 */
export type GetUserAnswerResponse = ApiResponse<UserAnswer>;

/**
 * Parâmetros para buscar perguntas
 */
export interface GetAnamnesisQuestionsParams {
  locale: string;
  keyPrefix?: string;
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

/**
 * Scores de mental e physical do usuário
 */
export interface UserScores {
  mental: number;
  physical: number;
  maxMental: number;
  maxPhysical: number;
  mentalPercentage: number;
  physicalPercentage: number;
}

/**
 * Resposta da API para scores do usuário
 */
export type GetUserScoresResponse = ApiResponse<UserScores>;

/**
 * Parâmetros para buscar scores do usuário
 */
export interface GetUserScoresParams {
  userId: string;
}

/**
 * Marker (indicador) do usuário
 */
export interface UserMarker {
  id: string;
  name: string;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Resposta da API para markers do usuário
 */
export type GetUserMarkersResponse = ApiResponse<UserMarker[]>;

/**
 * Parâmetros para buscar markers do usuário
 */
export interface GetUserMarkersParams {
  userId: string;
}

export type { BuildAnswerResult, UseAnamnesisQuestionnaireParams, UseAnamnesisQuestionnaireReturn } from './hooks';
