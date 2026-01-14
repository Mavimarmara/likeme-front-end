import type { AnamnesisQuestion, UserAnswer } from '@/types/anamnesis';

export type BodySymptomLevel = 'grave' | 'moderado' | 'leve' | 'sem' | 'plena';

const clampInt = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function parseMindAnswer(answer: UserAnswer): number | undefined {
  const fromText = answer.answerText ? parseInt(answer.answerText, 10) : NaN;
  if (!Number.isNaN(fromText)) {
    return clampInt(fromText, 0, 10);
  }

  const fromKey = answer.answerOptionKey ? parseInt(answer.answerOptionKey, 10) : NaN;
  if (!Number.isNaN(fromKey)) {
    return clampInt(fromKey, 0, 10);
  }

  return undefined;
}

export function buildMindAnswer(value: number, question: AnamnesisQuestion) {
  const clamped = clampInt(value, 0, 10);
  const option = question.answerOptions.find((o) => o.key === String(clamped));
  return {
    answerOptionId: option?.id ?? null,
    answerText: String(clamped),
  };
}

const VALUE_TO_BODY_LEVEL: Record<number, BodySymptomLevel> = {
  0: 'sem',
  1: 'leve',
  2: 'moderado',
  3: 'grave',
  4: 'plena',
};

const BODY_LEVEL_TO_VALUE: Record<BodySymptomLevel, number> = {
  sem: 0,
  leve: 1,
  moderado: 2,
  grave: 3,
  plena: 4,
};

const BODY_LEVEL_TO_OPTION_KEY: Record<BodySymptomLevel, string> = {
  grave: 'grave',
  moderado: 'moderado',
  leve: 'leve',
  sem: 'sem_sintomas',
  plena: 'plena_saude',
};

export function parseBodyAnswer(answer: UserAnswer): BodySymptomLevel | undefined {
  const key = answer.answerOptionKey?.toLowerCase().trim();
  if (key) {
    const mapped: Record<string, BodySymptomLevel> = {
      grave: 'grave',
      moderado: 'moderado',
      leve: 'leve',
      sem: 'sem',
      sem_sintomas: 'sem',
      plena: 'plena',
      plena_saude: 'plena',
      none: 'sem',
      low: 'leve',
      medium: 'moderado',
      high: 'grave',
      very_high: 'plena',
    };
    if (mapped[key]) {
      return mapped[key];
    }
  }

  const fromText = answer.answerText ? parseInt(answer.answerText, 10) : NaN;
  if (!Number.isNaN(fromText) && VALUE_TO_BODY_LEVEL[fromText] !== undefined) {
    return VALUE_TO_BODY_LEVEL[fromText];
  }

  return undefined;
}

export function buildBodyAnswer(value: BodySymptomLevel, question: AnamnesisQuestion) {
  const optionKey = BODY_LEVEL_TO_OPTION_KEY[value];
  const option = question.answerOptions.find((o) => o.key === optionKey);
  return {
    answerOptionId: option?.id ?? null,
    answerText: String(BODY_LEVEL_TO_VALUE[value]),
  };
}


