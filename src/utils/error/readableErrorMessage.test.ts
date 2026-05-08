import { getReadableErrorMessage } from '@/utils/error/readableErrorMessage';

describe('getReadableErrorMessage', () => {
  it('retorna message de Error', () => {
    expect(getReadableErrorMessage(new Error('falha de rede'), 'fallback')).toBe('falha de rede');
  });

  it('retorna message de objeto ApiError do apiClient', () => {
    expect(getReadableErrorMessage({ message: 'token inválido', status: 401 }, 'fallback')).toBe('token inválido');
  });

  it('usa fallback quando não há mensagem útil', () => {
    expect(getReadableErrorMessage(null, 'fallback')).toBe('fallback');
    expect(getReadableErrorMessage({ message: '' }, 'fallback')).toBe('fallback');
  });
});
