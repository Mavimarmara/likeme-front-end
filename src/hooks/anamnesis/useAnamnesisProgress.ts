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

  const calculateProgress = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Obter usuário autenticado
        const profileResponse = await userService.getProfile();
        const userId = profileResponse.success ? profileResponse.data?.id : null;
        if (!userId) {
          throw new Error('Usuário não identificado');
        }

        // Buscar todas as perguntas
        const [
          physicalResponse,
          mentalResponse,
          movimentoResponse,
          espiritualidadeResponse,
          sonoResponse,
          nutricaoResponse,
          estresseResponse,
          autoestimaResponse,
          relacionamentosResponse,
          saudeBucalResponse,
          propositoResponse,
          userAnswersResponse,
        ] = await Promise.all([
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'physical' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'mental' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_movimento' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_espiritualidade' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_sono' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_nutricao' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_estresse' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_autoestima' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_relacionamentos' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_saude_bucal' }),
          anamnesisService.getQuestions({ locale: 'pt-BR', keyPrefix: 'habits_proposito' }),
          anamnesisService.getUserAnswers({ userId }),
        ]);

        const userAnswers = userAnswersResponse.data || [];
        const answeredQuestionIds = new Set(userAnswers.map(a => a.questionConceptId));

        const calculateCategoryProgress = (
          questions: any[],
          category: string
        ): CategoryProgress => {
          const total = questions.length;
          const answered = questions.filter(q => answeredQuestionIds.has(q.id)).length;
          return {
            category,
            total,
            answered,
            percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
          };
        };

        const physicalProgress = calculateCategoryProgress(
          physicalResponse.data || [],
          'physical'
        );
        const mentalProgress = calculateCategoryProgress(mentalResponse.data || [], 'mental');

        const habitsProgress = {
          movimento: calculateCategoryProgress(movimentoResponse.data || [], 'movimento'),
          espiritualidade: calculateCategoryProgress(
            espiritualidadeResponse.data || [],
            'espiritualidade'
          ),
          sono: calculateCategoryProgress(sonoResponse.data || [], 'sono'),
          nutricao: calculateCategoryProgress(nutricaoResponse.data || [], 'nutricao'),
          estresse: calculateCategoryProgress(estresseResponse.data || [], 'estresse'),
          autoestima: calculateCategoryProgress(autoestimaResponse.data || [], 'autoestima'),
          relacionamentos: calculateCategoryProgress(
            relacionamentosResponse.data || [],
            'relacionamentos'
          ),
          saude_bucal: calculateCategoryProgress(saudeBucalResponse.data || [], 'saude_bucal'),
          proposito: calculateCategoryProgress(propositoResponse.data || [], 'proposito'),
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
    },
    []
  );

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

