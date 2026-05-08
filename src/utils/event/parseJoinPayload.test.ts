import { parseJoinPayload } from '@/utils/event/parseJoinPayload';
import type { JoinEventApiResponse, EventJoinPayload } from '@/types/event';

const payload: EventJoinPayload = {
  provider: 'zoom',
  externalUrl: 'https://us02web.zoom.us/j/1',
  meetingNumber: '1',
  signature: 's',
  sdkKey: 'k',
  role: 0,
  userName: 'u',
};

describe('parseJoinPayload', () => {
  it('retorna data quando success e payload presentes', () => {
    const res: JoinEventApiResponse = { success: true, data: payload };
    expect(parseJoinPayload(res)).toEqual(payload);
  });

  it('aceita status success', () => {
    const res: JoinEventApiResponse = { status: 'success', data: payload };
    expect(parseJoinPayload(res)).toEqual(payload);
  });

  it('lança quando resposta inválida ou sem data', () => {
    expect(() => parseJoinPayload({ success: false, message: 'falhou' })).toThrow('falhou');
    expect(() => parseJoinPayload({ success: true })).toThrow('Não foi possível preparar a entrada no evento');
  });
});
