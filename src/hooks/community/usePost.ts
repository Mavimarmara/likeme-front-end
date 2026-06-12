import { useCallback, useEffect, useRef, useState } from 'react';
import type { Post } from '@/types';
import communityService from '@/services/community/communityService';
import { logger } from '@/utils/logger';
import { mergePollDetailIntoPoll } from '@/utils/community/pollDetailMapper';
import { isPollClosed } from '@/utils/community/pollClosure';

export function usePost(post: Post) {
  const [livePoll, setLivePoll] = useState(post.poll);

  useEffect(() => {
    setLivePoll(post.poll);
  }, [post.poll]);

  const postRef = useRef(post);
  postRef.current = post;

  const pollId = post.poll?.pollId;

  useEffect(() => {
    if (!pollId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const detail = await communityService.getPollDetail(pollId);
        if (cancelled) return;
        const latestPost = postRef.current;
        setLivePoll((prev) => {
          const baseline = prev ?? latestPost.poll;
          if (!baseline?.options.length) return prev;
          return mergePollDetailIntoPoll(detail, baseline, latestPost.id);
        });
      } catch (error) {
        if (!cancelled) {
          logger.error('Falha ao sincronizar enquete', {
            pollId,
            postId: postRef.current.id,
            cause: error,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [post.id, pollId]);

  const activePoll = livePoll ?? post.poll;

  const submitPollVote = useCallback(
    async (_pollPostId: string, answerId: string) => {
      const latest = postRef.current;
      const baseline = livePoll ?? latest.poll;
      const realPollId = baseline?.pollId;

      if (!realPollId) {
        logger.error('Poll ID não encontrado na enquete', {
          postId: latest.id,
          pollId: baseline?.id,
          pollData: baseline,
        });
        throw new Error('pollId ausente');
      }

      if (!baseline) {
        throw new Error('Dados da enquete ausentes');
      }

      const pollClosed = isPollClosed({
        endedAt: baseline.endedAt,
        isFinished: baseline.isFinished,
      });

      if (pollClosed) {
        throw new Error('Enquete encerrada');
      }

      logger.debug('Votando na enquete:', {
        pollId: realPollId,
        answerId,
        postId: latest.id,
      });

      await communityService.votePoll(realPollId, [answerId]);

      try {
        const detail = await communityService.getPollDetail(realPollId);
        setLivePoll(mergePollDetailIntoPoll(detail, baseline, latest.id));
      } catch (refreshError) {
        logger.error('Voto registrado, mas falha ao atualizar resultados da enquete', {
          pollId: realPollId,
          cause: refreshError,
        });
      }

      logger.info('Voto registrado com sucesso:', { pollId: realPollId, answerId });
    },
    [livePoll],
  );

  return {
    activePoll,
    submitPollVote,
  };
}
