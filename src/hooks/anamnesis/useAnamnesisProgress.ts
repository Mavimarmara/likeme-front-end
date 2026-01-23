import { useState, useEffect, useCallback } from 'react';
import anamnesisService from '@/services/anamnesis/anamnesisService';
import userService from '@/services/user/userService';
import { logger } from '@/utils/logger';

export interface CategoryProgress {
  category: string;
  total: number;
  answered: number;
  percentage: number;
}

export interface AnamnesisProgress {
  physical: CategoryProgress;
  mental: CategoryProgress;
  habits: {
    movimento: CategoryProgress;
    espiritualidade: CategoryProgress;
    sono: CategoryProgress;
    nutricao: CategoryProgress;
    estresse: CategoryProgress;
    autoestima: CategoryProgress;
    relacionamentos: CategoryProgress;
    saude_bucal: CategoryProgress;
    proposito: CategoryProgress;
  };
  overall: {
    total: number;
    answered: number;
    percentage: number;
  };
}

export const useAnamnesisProgress = () => {
  const [progress, setProgress] = useState<AnamnesisProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Obter usuário autenticado
      const profileResponse = await userService.getProfile();
      const userId = profileResponse.success ? profileResponse.data?.id : null;
      if (!userId) {
        throw new Error('Usuário não identificado');
      }

      // Buscar TODAS as perguntas de uma vez + respostas do usuário (apenas 2 requisições)
      const [allQuestionsResponse, userAnswersResponse] = await Promise.all([
        anamnesisService.getQuestions({ locale: 'pt-BR' }), // Sem filtro = todas as perguntas
        anamnesisService.getUserAnswers({ userId }),
      ]);

      const allQuestions = allQuestionsResponse.data || [];
      const userAnswers = userAnswersResponse.data || [];
      const answeredQuestionIds = new Set(userAnswers.map((a) => a.questionConceptId));

      // Filtrar perguntas por categoria (no frontend)
      const filterByPrefix = (prefix: string) =>
        allQuestions.filter((q) => q.key.startsWith(prefix));

      const calculateCategoryProgress = (questions: any[], category: string): CategoryProgress => {
        const total = questions.length;
        const answered = questions.filter((q) => answeredQuestionIds.has(q.id)).length;
        return {
          category,
          total,
          answered,
          percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
        };
      };

      const physicalQuestions = filterByPrefix('physical');
      const mentalQuestions = filterByPrefix('mental');

      const physicalProgress = calculateCategoryProgress(physicalQuestions, 'physical');
      const mentalProgress = calculateCategoryProgress(mentalQuestions, 'mental');

      const habitsProgress = {
        movimento: calculateCategoryProgress(filterByPrefix('habits_movimento'), 'movimento'),
        espiritualidade: calculateCategoryProgress(
          filterByPrefix('habits_espiritualidade'),
          'espiritualidade'
        ),
        sono: calculateCategoryProgress(filterByPrefix('habits_sono'), 'sono'),
        nutricao: calculateCategoryProgress(filterByPrefix('habits_nutricao'), 'nutricao'),
        estresse: calculateCategoryProgress(filterByPrefix('habits_estresse'), 'estresse'),
        autoestima: calculateCategoryProgress(filterByPrefix('habits_autoestima'), 'autoestima'),
        relacionamentos: calculateCategoryProgress(
          filterByPrefix('habits_relacionamentos'),
          'relacionamentos'
        ),
        saude_bucal: calculateCategoryProgress(filterByPrefix('habits_saude_bucal'), 'saude_bucal'),
        proposito: calculateCategoryProgress(filterByPrefix('habits_proposito'), 'proposito'),
      };

      const totalQuestions =
        physicalProgress.total +
        mentalProgress.total +
        Object.values(habitsProgress).reduce((sum, cat) => sum + cat.total, 0);

      const totalAnswered =
        physicalProgress.answered +
        mentalProgress.answered +
        Object.values(habitsProgress).reduce((sum, cat) => sum + cat.answered, 0);

      const progressData: AnamnesisProgress = {
        physical: physicalProgress,
        mental: mentalProgress,
        habits: habitsProgress,
        overall: {
          total: totalQuestions,
          answered: totalAnswered,
          percentage: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0,
        },
      };

      setProgress(progressData);
      logger.debug('Anamnesis progress calculated:', progressData);
    } catch (err: any) {
      logger.error('Error calculating anamnesis progress:', err);
      setError(err.message || 'Erro ao calcular progresso');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  return {
    progress,
    loading,
    error,
    refresh: () => calculateProgress(true),
  };
};
