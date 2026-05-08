import communityService from '@/services/community/communityService';
import apiClient from '@/services/infrastructure/apiClient';
import { logger } from '@/utils/logger';

jest.mock('@/services/infrastructure/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('communityService.getMyCommunityTermsAccepted', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna false sem erro para 404 (regressão de aceite de termos)', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue({
      message: 'Comunidade não encontrada',
      status: 404,
    });

    const accepted = await communityService.getMyCommunityTermsAccepted('community-1');

    expect(accepted).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith(
      'Aceite dos termos indisponível no momento; usando false como fallback',
      expect.objectContaining({ communityId: 'community-1', status: 404 }),
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('retorna false sem erro para 401', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue({
      message: 'Sessão expirada. Faça login novamente.',
      status: 401,
    });

    const accepted = await communityService.getMyCommunityTermsAccepted('community-2');

    expect(accepted).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith(
      'Aceite dos termos indisponível no momento; usando false como fallback',
      expect.objectContaining({ communityId: 'community-2', status: 401 }),
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('loga erro para falhas inesperadas', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('timeout'));

    const accepted = await communityService.getMyCommunityTermsAccepted('community-3');

    expect(accepted).toBe(false);
    expect(logger.error).toHaveBeenCalledWith('Erro ao obter aceite dos termos da comunidade', {
      communityId: 'community-3',
      cause: expect.any(Error),
    });
  });
});
