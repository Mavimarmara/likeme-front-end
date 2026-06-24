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

  describe('getMySelectedCategoryIds', () => {
    it('mapeia categorias da person para ids de interesse', async () => {
      mockApiClient.get.mockResolvedValue({
        success: true,
        data: [
          { categoryId: 'cat-sleep', name: 'Sono' },
          { categoryId: 'cat-activity', name: 'Movimento' },
        ],
      });

      await expect(personCategoryService.getMySelectedCategoryIds()).resolves.toEqual(['sleep', 'activity']);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/person-categories/me/categories', undefined, true);
    });
  });

  describe('saveMyCategories', () => {
    it('sincroniza categorias selecionadas via PUT', async () => {
      await personCategoryService.saveMyCategories(['sleep', 'activity', 'nutrition']);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        '/api/person-categories/me/categories',
        { categoryIds: ['cat-sleep', 'cat-activity', 'cat-nutrition'] },
        true,
      );
    });

    it('lança erro quando nenhuma categoria mapeia para o catálogo', async () => {
      await expect(personCategoryService.saveMyCategories(['categoria-inexistente'])).rejects.toThrow(
        'Nenhuma categoria válida para salvar',
      );
    });
  });

  describe('syncMyCategories', () => {
    it('sincroniza lista vazia removendo todas as categorias', async () => {
      await personCategoryService.syncMyCategories([]);

      expect(mockApiClient.put).toHaveBeenCalledWith('/api/person-categories/me/categories', { categoryIds: [] }, true);
    });

    it('propaga erro quando API falha', async () => {
      mockApiClient.put.mockRejectedValue(Object.assign(new Error('Erro interno'), { status: 500 }));

      await expect(personCategoryService.syncMyCategories(['sleep'])).rejects.toThrow('Erro interno');
    });
  });
});
