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
            contacts: [{ type: 'email', value: 'contato@example.com' }],
          },
        },
        advertiserId: 'adv-2',
      }),
    );

    expect(result.current.hasSpecialistPartner).toBe(true);
    expect(result.current.partnerData.name).toBe('Do Anuncio');
    expect(advertiserService.getAdvertiserById).not.toHaveBeenCalled();
  });

  it('busca advertiser quando o ad traz nome mas nao traz contatos', async () => {
    (advertiserService.getAdvertiserById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'adv-3',
        name: 'Provider Completo',
        status: 'active',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        contacts: [{ type: 'whatsapp', value: '5511999999999' }],
      },
    });

    const { result } = renderHook(() =>
      useProductPartner({
        product: null,
        ad: {
          id: 'ad-1',
          status: 'active',
          createdAt: '',
          updatedAt: '',
          advertiser: {
            id: 'adv-3',
            name: 'Do Anuncio',
            status: 'active',
            createdAt: '',
            updatedAt: '',
          },
        },
        advertiserId: 'adv-3',
      }),
    );

    await waitFor(() => {
      expect(result.current.partnerContacts).toEqual([{ type: 'whatsapp', value: '5511999999999' }]);
    });

    expect(advertiserService.getAdvertiserById).toHaveBeenCalledWith('adv-3');
    expect(result.current.partnerData.name).toBe('Do Anuncio');
  });

  it('busca contatos quando advertiserId vem de product.ads e ad ainda e null', async () => {
    (advertiserService.getAdvertiserById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'adv-embedded',
        name: 'Provider Embutido',
        status: 'active',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        contacts: [{ type: 'email', value: 'embedded@example.com' }],
      },
    });

    const { result } = renderHook(() =>
      useProductPartner({
        product: {
          id: 'svc-1',
          type: 'service',
          ads: [
            {
              id: 'ad-1',
              advertiserId: 'adv-embedded',
              status: 'active',
              createdAt: '',
              updatedAt: '',
            },
          ],
        } as never,
        ad: null,
        advertiserId: 'adv-embedded',
      }),
    );

    await waitFor(() => {
      expect(result.current.partnerContacts).toEqual([{ type: 'email', value: 'embedded@example.com' }]);
    });

    expect(advertiserService.getAdvertiserById).toHaveBeenCalledWith('adv-embedded');
  });

  it('busca contatos quando advertiserId vem apenas de ad.advertiser.id', async () => {
    (advertiserService.getAdvertiserById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'adv-nested-id',
        name: 'Provider API',
        status: 'active',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        contacts: [{ type: 'instagram', value: '@provider' }],
      },
    });

    const { result } = renderHook(() =>
      useProductPartner({
        product: null,
        ad: {
          id: 'ad-1',
          status: 'active',
          createdAt: '',
          updatedAt: '',
          advertiser: {
            id: 'adv-nested-id',
            name: 'Provider Anuncio',
            status: 'active',
            createdAt: '',
            updatedAt: '',
          },
        },
        advertiserId: 'adv-nested-id',
      }),
    );

    await waitFor(() => {
      expect(result.current.partnerContacts).toEqual([{ type: 'instagram', value: '@provider' }]);
    });

    expect(advertiserService.getAdvertiserById).toHaveBeenCalledWith('adv-nested-id');
  });

  it('resolve advertiserId internamente a partir de product.ads quando prop ausente', async () => {
    (advertiserService.getAdvertiserById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'adv-embedded',
        name: 'Provider Embutido',
        status: 'active',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        contacts: [{ type: 'whatsapp', value: '5511888888888' }],
      },
    });

    const { result } = renderHook(() =>
      useProductPartner({
        product: {
          id: 'svc-1',
          type: 'service',
          ads: [
            {
              id: 'ad-1',
              advertiserId: 'adv-embedded',
              status: 'active',
              createdAt: '',
              updatedAt: '',
            },
          ],
        } as never,
        ad: null,
        advertiserId: undefined,
      }),
    );

    await waitFor(() => {
      expect(result.current.partnerContacts).toEqual([{ type: 'whatsapp', value: '5511888888888' }]);
    });

    expect(advertiserService.getAdvertiserById).toHaveBeenCalledWith('adv-embedded');
  });
});
