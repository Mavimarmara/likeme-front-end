import type { EventJoinPayload, JoinEventApiResponse } from '@/types/event';

export function parseJoinPayload(res: JoinEventApiResponse): EventJoinPayload {
  const ok = res.success === true || res.status === 'success';
  if (!ok || !res.data) {
    throw new Error(res.message || 'Não foi possível preparar a entrada no evento');
  }
  return res.data;
}
