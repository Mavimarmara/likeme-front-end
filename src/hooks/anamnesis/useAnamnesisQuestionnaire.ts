import { useCallback, useEffect, useMemo, useState } from 'react';
import { anamnesisService, storageService, userService } from '@/services';
import type { AnamnesisQuestion } from '@/types/anamnesis';
import type {
  UseAnamnesisQuestionnaireParams,
  UseAnamnesisQuestionnaireReturn,
} from '@/types/anamnesis';

export function useAnamnesisQuestionnaire<T>(
  params: UseAnamnesisQuestionnaireParams<T>
): UseAnamnesisQuestionnaireReturn<T> {
  const [userId, setUserId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AnamnesisQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, T | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionsById = useMemo(() => {
    const map = new Map<string, AnamnesisQuestion>();
    for (const q of questions) {
      map.set(q.id, q);
    }
    return map;
  }, [questions]);

  const unansweredCount = useMemo(() => {
    return questions.reduce((acc, q) => (answers[q.id] === undefined ? acc + 1 : acc), 0);
  }, [answers, questions]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileResponse = await userService.getProfile();
      const currentUserId = profileResponse.success ? profileResponse.data?.id : null;
      if (!currentUserId) {
        throw new Error('Usuário não identificado');
      }
      setUserId(currentUserId);

      const questionsResponse = await anamnesisService.getQuestions({
        locale: params.locale,
        keyPrefix: params.keyPrefix,
      });

      const fetchedQuestions = questionsResponse.success ? questionsResponse.data ?? [] : [];
      setQuestions(fetchedQuestions);

      const questionIds = new Set(fetchedQuestions.map((q) => q.id));
      const answersResponse = await anamnesisService.getUserAnswers({
        userId: currentUserId,
        locale: params.locale,
      });

      const nextAnswers: Record<string, T | undefined> = {};
      const fetchedAnswers = answersResponse.success ? answersResponse.data ?? [] : [];
      for (const a of fetchedAnswers) {
        if (!questionIds.has(a.questionConceptId)) {
          continue;
        }
        const parsed = params.parseAnswer(a);
        if (parsed !== undefined) {
          nextAnswers[a.questionConceptId] = parsed;
        }
      }
      setAnswers(nextAnswers);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar anamnese';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params.keyPrefix, params.locale, params.parseAnswer]);

  useEffect(() => {
    load();
  }, [load]);

  const setAnswer = useCallback(
    async (questionConceptId: string, value: T) => {
      if (!userId) {
        return;
      }

      setAnswers((prev) => ({
        ...prev,
        [questionConceptId]: value,
      }));

      const question = questionsById.get(questionConceptId);
      if (!question) {
        return;
      }

      try {
        const built = params.buildAnswer(value, question);
        await anamnesisService.createOrUpdateAnswer({
          userId,
          questionConceptId,
          answerOptionId: built.answerOptionId,
          answerText: built.answerText,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao salvar resposta';
        setError(message);
      }
    },
    [params, questionsById, userId]
  );

  const complete = useCallback(async () => {
    setCompleting(true);
    try {
      await storageService.setAnamnesisCompletedAt(new Date().toISOString());
    } finally {
      setCompleting(false);
    }
  }, []);

  return {
    userId,
    questions,
    answers,
    loading,
    completing,
    error,
    unansweredCount,
    reload: load,
    setAnswer,
    complete,
  };
}
