import AsyncStorage from '@react-native-async-storage/async-storage';
import storageService from './storageService';

const mockGetMySelectedCategoryIds = jest.fn();

jest.mock('../person/personCategoryService', () => ({
  __esModule: true,
  default: {
    getMySelectedCategoryIds: (...args: unknown[]) => mockGetMySelectedCategoryIds(...args),
  },
}));

describe('storageService.getCategorySelectedAt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMySelectedCategoryIds.mockResolvedValue([]);
  });

  it('retorna timestamp do cache local quando objectivesSelectedAt já está salvo', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2026-01-04T00:00:00.000Z');

    await expect(storageService.getCategorySelectedAt()).resolves.toBe('2026-01-04T00:00:00.000Z');
    expect(mockGetMySelectedCategoryIds).not.toHaveBeenCalled();
  });

  it('consulta person-categories e hidrata o cache quando storage está vazio', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    mockGetMySelectedCategoryIds.mockResolvedValue(['sleep']);

    const result = await storageService.getCategorySelectedAt();

    expect(mockGetMySelectedCategoryIds).toHaveBeenCalled();
    expect(result).toEqual(expect.any(String));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@likeme:objectives_selected_at', result);
  });

  it('retorna null quando storage e person-categories estão vazios', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    mockGetMySelectedCategoryIds.mockResolvedValue([]);

    await expect(storageService.getCategorySelectedAt()).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
