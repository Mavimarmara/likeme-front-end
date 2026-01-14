import type { AnamnesisQuestion, UserAnswer } from '@/types/anamnesis';

export type BuildAnswerResult = {
  answerOptionId: string | null;
  answerText: string | null;
};

export type UseAnamnesisQuestionnaireParams<T> = {
  locale: string;
  keyPrefix: string;
  parseAnswer: (answer: UserAnswer) => T | undefined;
  buildAnswer: (value: T, question: AnamnesisQuestion) => BuildAnswerResult;
};

export type UseAnamnesisQuestionnaireReturn<T> = {
  userId: string | null;
  questions: AnamnesisQuestion[];
  answers: Record<string, T | undefined>;
  loading: boolean;
  completing: boolean;
  error: string | null;
  unansweredCount: number;
  reload: () => Promise<void>;
  setAnswer: (questionConceptId: string, value: T) => Promise<void>;
  complete: () => Promise<void>;
};


