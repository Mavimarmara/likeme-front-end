import { renderHook, waitFor } from '@testing-library/react-native';
import { useProductPartner } from './useProductPartner';
import advertiserService from '@/services/advertiser/advertiserService';

jest.mock('@/services/advertiser/advertiserService', () => ({
  __esModule: true,
  default: {
    getAdvertiserById: jest.fn(),
  },
}));

describe('useProductPartner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca advertiser por id quando o ad nao traz advertiser aninhado', async () => {
    (advertiserService.getAdvertiserById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'adv-1',
        name: 'Parceiro API',
        logo: 'https://example.com/a.jpg',
        status: 'active',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    });

    const { result } = renderHook(() =>
      useProductPartner({
        product: { id: 'p1', advertiserId: 'adv-1' } as never,
        ad: { id: 'ad-1', advertiserId: 'adv-1', status: 'active', createdAt: '', updatedAt: '' },
        advertiserId: 'adv-1',
      }),
    );

    await waitFor(() => {
      expect(result.current.hasSpecialistPartner).toBe(true);
      expect(result.current.partnerData.name).toBe('Parceiro API');
    });

    expect(advertiserService.getAdvertiserById).toHaveBeenCalledWith('adv-1');
  });

  it('usa advertiser do ad sem chamar a API', () => {
    const { result } = renderHook(() =>
      useProductPartner({
        product: null,
        ad: {
          id: 'ad-1',
          status: 'active',
          createdAt: '',
          updatedAt: '',
          advertiser: {
            id: 'adv-2',
            name: 'Do Anuncio',
            status: 'active',
            createdAt: '',
            updatedAt: '',
          },
        },
        advertiserId: 'adv-2',
      }),
    );

    expect(result.current.hasSpecialistPartner).toBe(true);
    expect(result.current.partnerData.name).toBe('Do Anuncio');
    expect(advertiserService.getAdvertiserById).not.toHaveBeenCalled();
  });
});
