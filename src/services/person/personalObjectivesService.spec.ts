import personalObjectivesService from './personalObjectivesService';
import apiClient from '../infrastructure/apiClient';
import storageService from '../auth/storageService';

jest.mock('../infrastructure/apiClient');
jest.mock('../auth/storageService', () => ({
  __esModule: true,
  default: {
    getSelectedObjectivesIds: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockStorage = storageService as jest.Mocked<typeof storageService>;

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
    it('persiste objetivos únicos no backend a partir dos marcadores do onboarding', async () => {
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

  describe('backfillMyObjectivesFromLocalStorageIfNeeded', () => {
    it('não chama API quando não há IDs locais', async () => {
      mockStorage.getSelectedObjectivesIds.mockResolvedValue([]);

      await personalObjectivesService.backfillMyObjectivesFromLocalStorageIfNeeded();

      expect(mockApiClient.get).not.toHaveBeenCalled();
      expect(mockApiClient.post).not.toHaveBeenCalled();
    });

    it('não chama POST quando usuário já tem objetivos no backend', async () => {
      mockStorage.getSelectedObjectivesIds.mockResolvedValue(['sleep']);
      mockApiClient.get.mockResolvedValueOnce({
        success: true,
        data: [{ objective: { id: 'obj-sleep', name: 'Improve my sleep' } }],
      });

      await personalObjectivesService.backfillMyObjectivesFromLocalStorageIfNeeded();

      expect(mockApiClient.post).not.toHaveBeenCalled();
    });

    it('faz backfill quando há IDs locais e backend está vazio', async () => {
      mockStorage.getSelectedObjectivesIds.mockResolvedValue(['sleep', 'activity']);
      mockApiClient.get.mockResolvedValueOnce({ success: true, data: [] }).mockResolvedValueOnce(catalogObjectives);

      await personalObjectivesService.backfillMyObjectivesFromLocalStorageIfNeeded();

      expect(mockApiClient.post).toHaveBeenCalledTimes(2);
    });
  });
});
