import personalObjectivesService from './personalObjectivesService';
import apiClient from '../infrastructure/apiClient';

jest.mock('../infrastructure/apiClient');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

const catalogObjectives = {
  success: true,
  message: 'ok',
  data: {
    objectives: [
      { id: 'obj-sleep', name: 'Improve my sleep', order: 4 },
      { id: 'obj-activity', name: 'Move more', order: 10 },
      { id: 'obj-nutrition', name: 'Eat better', order: 6 },
    ],
    pagination: { page: 1, limit: 100, total: 3, totalPages: 1 },
  },
};

describe('personalObjectivesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient.get.mockResolvedValue(catalogObjectives);
    mockApiClient.post.mockResolvedValue({ success: true });
  });

  describe('saveMyObjectivesFromMarkerIds', () => {
    it('persiste categorias únicas no backend a partir dos marcadores selecionados', async () => {
      await personalObjectivesService.saveMyObjectivesFromMarkerIds(['sleep', 'activity', 'nutrition']);

      expect(mockApiClient.post).toHaveBeenCalledTimes(3);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/user-personal-objectives/me/objectives',
        { objectiveId: 'obj-sleep' },
        true,
      );
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/user-personal-objectives/me/objectives',
        { objectiveId: 'obj-activity' },
        true,
      );
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/user-personal-objectives/me/objectives',
        { objectiveId: 'obj-nutrition' },
        true,
      );
    });

    it('ignora 409 quando objetivo já está vinculado ao usuário', async () => {
      mockApiClient.post
        .mockRejectedValueOnce(Object.assign(new Error('Você já possui este objetivo'), { status: 409 }))
        .mockResolvedValueOnce({ success: true });

      await personalObjectivesService.saveMyObjectivesFromMarkerIds(['sleep', 'activity']);

      expect(mockApiClient.post).toHaveBeenCalledTimes(2);
    });

    it('propaga erro quando API falha com status diferente de 409', async () => {
      mockApiClient.post.mockRejectedValue(Object.assign(new Error('Erro interno'), { status: 500 }));

      await expect(personalObjectivesService.saveMyObjectivesFromMarkerIds(['sleep'])).rejects.toThrow('Erro interno');
    });

    it('lança erro quando nenhum marcador mapeia para objetivo do catálogo', async () => {
      await expect(personalObjectivesService.saveMyObjectivesFromMarkerIds(['marcador-inexistente'])).rejects.toThrow(
        'Nenhum objetivo válido para salvar',
      );
    });
  });

  describe('syncMyObjectivesFromMarkerIds', () => {
    beforeEach(() => {
      mockApiClient.get.mockImplementation((url: string) => {
        if (url === '/api/user-personal-objectives/me/objectives') {
          return Promise.resolve({
            success: true,
            data: [{ objective: { id: 'obj-sleep', name: 'Improve my sleep' } }],
          });
        }
        return Promise.resolve(catalogObjectives);
      });
      mockApiClient.delete.mockResolvedValue({ success: true });
    });

    it('adiciona novas categorias e remove as desmarcadas', async () => {
      await personalObjectivesService.syncMyObjectivesFromMarkerIds(['activity']);

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/api/user-personal-objectives/me/objectives/obj-sleep',
        undefined,
        true,
      );
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/user-personal-objectives/me/objectives',
        { objectiveId: 'obj-activity' },
        true,
      );
    });

    it('remove todas as categorias quando seleção fica vazia', async () => {
      await personalObjectivesService.syncMyObjectivesFromMarkerIds([]);

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/api/user-personal-objectives/me/objectives/obj-sleep',
        undefined,
        true,
      );
      expect(mockApiClient.post).not.toHaveBeenCalled();
    });
  });
});
