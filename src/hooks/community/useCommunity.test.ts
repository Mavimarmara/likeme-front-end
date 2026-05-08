import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useCommunity } from '@/hooks/community/useCommunity';
import { communityService } from '@/services';
import { logger } from '@/utils/logger';

jest.mock('@/services', () => ({
  communityService: {
    getMyCommunityTermsAccepted: jest.fn(),
    updateMyCommunityTermsAccepted: jest.fn(),
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
  },
}));

describe('useCommunity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carrega aceite de termos ao receber communityId', async () => {
    (communityService.getMyCommunityTermsAccepted as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useCommunity({ communityId: 'community-1' }));

    expect(result.current.termsAccepted).toBeNull();

    await waitFor(() => {
      expect(result.current.termsAccepted).toBe(true);
    });
  });

  it('mantém false quando leitura de termos falha', async () => {
    (communityService.getMyCommunityTermsAccepted as jest.Mock).mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useCommunity({ communityId: 'community-2' }));

    await waitFor(() => {
      expect(result.current.termsAccepted).toBe(false);
    });
  });

  it('toggle persiste valor e mantém valor retornado pelo servidor', async () => {
    (communityService.getMyCommunityTermsAccepted as jest.Mock).mockResolvedValue(false);
    (communityService.updateMyCommunityTermsAccepted as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useCommunity({ communityId: 'community-3' }));

    await waitFor(() => {
      expect(result.current.termsAccepted).toBe(false);
    });

    act(() => {
      result.current.toggleTermsAccepted();
    });

    await waitFor(() => {
      expect(communityService.updateMyCommunityTermsAccepted).toHaveBeenCalledWith('community-3', true);
      expect(result.current.termsAccepted).toBe(true);
    });
  });

  it('toggle faz rollback quando persistência falha', async () => {
    (communityService.getMyCommunityTermsAccepted as jest.Mock).mockResolvedValue(true);
    (communityService.updateMyCommunityTermsAccepted as jest.Mock).mockRejectedValue(new Error('save-failed'));

    const { result } = renderHook(() => useCommunity({ communityId: 'community-4' }));

    await waitFor(() => {
      expect(result.current.termsAccepted).toBe(true);
    });

    act(() => {
      result.current.toggleTermsAccepted();
    });

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'Falha ao persistir aceite dos termos da comunidade',
        expect.objectContaining({
          communityId: 'community-4',
          attemptedValue: false,
        }),
      );
      expect(result.current.termsAccepted).toBe(true);
    });
  });
});
