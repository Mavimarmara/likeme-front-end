export type PollClosureInput = {
  endedAt?: string | Date | null;
  endDate?: string | Date | null;
  closedAt?: string | Date | null;
  isFinished?: boolean;
  status?: string | null;
};

const CLOSED_STATUSES = new Set(['closed', 'ended', 'inactive']);

export function parsePollInstant(value: string | Date | null | undefined): Date | undefined {
  if (value == null || value === '') {
    return undefined;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

export function resolvePollEndInstant(input: PollClosureInput): Date | undefined {
  return parsePollInstant(input.endedAt) ?? parsePollInstant(input.endDate) ?? parsePollInstant(input.closedAt);
}

export function isPollClosed(input: PollClosureInput, now: Date = new Date()): boolean {
  if (input.isFinished === true) {
    return true;
  }

  const status = input.status?.trim().toLowerCase();
  if (status && CLOSED_STATUSES.has(status)) {
    return true;
  }

  const endInstant = resolvePollEndInstant(input);
  if (!endInstant) {
    return false;
  }

  return endInstant.getTime() < now.getTime();
}

export function resolvePollState(input: PollClosureInput, now?: Date): { isClosed: boolean; endedAt?: Date } {
  const endedAt = resolvePollEndInstant(input);
  return {
    isClosed: isPollClosed(input, now),
    endedAt,
  };
}
