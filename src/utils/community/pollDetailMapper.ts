import type { Poll } from '@/types';

type PollDetailAnswer = {
  id?: string;
  data?: string;
  voteCount?: number;
  isVotedByUser?: boolean;
};

type PollDetailPayload = {
  pollId?: string;
  answers?: PollDetailAnswer[];
  endedAt?: string;
  status?: string;
};

function unwrapDataLayer(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw;
  const o = raw as Record<string, unknown>;
  if ('data' in o && o.data != null && typeof o.data === 'object') {
    return o.data;
  }
  return raw;
}

function extractPollEntity(raw: unknown): PollDetailPayload | null {
  const first = unwrapDataLayer(raw);
  if (!first || typeof first !== 'object') return null;
  const o = first as Record<string, unknown>;
  if ('polls' in o && Array.isArray(o.polls) && o.polls.length > 0) {
    return o.polls[0] as PollDetailPayload;
  }
  if ('answers' in o && Array.isArray(o.answers)) {
    return o as PollDetailPayload;
  }
  return null;
}

export function mergePollDetailIntoPoll(detailPayload: unknown, baseline: Poll, postId: string): Poll {
  const entity = extractPollEntity(detailPayload);
  if (!entity?.answers?.length) {
    return baseline;
  }

  const answers = entity.answers;
  const totalVotes = answers.reduce((sum, a) => sum + (a.voteCount ?? 0), 0);

  const options = answers.map((ans, index) => {
    const id = ans.id || `opt-${index}`;
    const prev = baseline.options.find((o) => o.id === id || o.answerId === id);
    return {
      id,
      answerId: ans.id,
      text: typeof ans.data === 'string' ? ans.data : prev?.text ?? `Opção ${index + 1}`,
      votes: ans.voteCount ?? 0,
      percentage: totalVotes > 0 ? Math.round(((ans.voteCount ?? 0) / totalVotes) * 100) : 0,
      isSelected: ans.isVotedByUser === true,
    };
  });

  const endedRaw = entity.endedAt;
  const endedAt = endedRaw ? new Date(endedRaw) : baseline.endedAt;

  return {
    ...baseline,
    id: postId,
    pollId: baseline.pollId ?? entity.pollId,
    options,
    totalVotes,
    endedAt,
    isFinished: Boolean(endedRaw) || baseline.isFinished,
  };
}
