import personCategoryService from './personCategoryService';
import apiClient from '../infrastructure/apiClient';
import categoryService from '../category/categoryService';

jest.mock('../infrastructure/apiClient');
jest.mock('../category/categoryService', () => ({
  __esModule: true,
  default: {
    listCategories: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockCategoryService = categoryService as jest.Mocked<typeof categoryService>;

const catalogCategories = [
  { categoryId: 'cat-sleep', name: 'Sono' },
  { categoryId: 'cat-activity', name: 'Movimento' },
  { categoryId: 'cat-nutrition', name: 'Nutrição' },
];

describe('personCategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCategoryService.listCategories.mockResolvedValue(catalogCategories);
    mockApiClient.put.mockResolvedValue({ success: true });
  });

  describe('getMySelectedMarkerIds', () => {
    it('mapeia categorias da person para marcadores de interesse', async () => {
      mockApiClient.get.mockResolvedValue({
        success: true,
        data: [
          { categoryId: 'cat-sleep', name: 'Sono' },
          { categoryId: 'cat-activity', name: 'Movimento' },
        ],
      });

      await expect(personCategoryService.getMySelectedMarkerIds()).resolves.toEqual(['sleep', 'activity']);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/person-categories/me/categories', undefined, true);
    });
  });

  describe('saveMyCategoriesFromMarkerIds', () => {
    it('sincroniza categorias selecionadas via PUT', async () => {
      await personCategoryService.saveMyCategoriesFromMarkerIds(['sleep', 'activity', 'nutrition']);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        '/api/person-categories/me/categories',
        { categoryIds: ['cat-sleep', 'cat-activity', 'cat-nutrition'] },
        true,
      );
    });

    it('lança erro quando nenhum marcador mapeia para categoria do catálogo', async () => {
      await expect(personCategoryService.saveMyCategoriesFromMarkerIds(['marcador-inexistente'])).rejects.toThrow(
        'Nenhuma categoria válida para salvar',
      );
    });
  });

  describe('syncMyCategoriesFromMarkerIds', () => {
    it('sincroniza lista vazia removendo todas as categorias', async () => {
      await personCategoryService.syncMyCategoriesFromMarkerIds([]);

      expect(mockApiClient.put).toHaveBeenCalledWith('/api/person-categories/me/categories', { categoryIds: [] }, true);
    });

    it('propaga erro quando API falha', async () => {
      mockApiClient.put.mockRejectedValue(Object.assign(new Error('Erro interno'), { status: 500 }));

      await expect(personCategoryService.syncMyCategoriesFromMarkerIds(['sleep'])).rejects.toThrow('Erro interno');
    });
  });
});
