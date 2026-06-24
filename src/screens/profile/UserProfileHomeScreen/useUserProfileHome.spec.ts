import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useUserProfileHome, PROFILE_HOME_MAX_VISIBLE_INTERESTS } from './useUserProfileHome';

const mockGetProfile = jest.fn();
const mockGetMySelectedCategoryIds = jest.fn();
const mockGetUser = jest.fn();

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (effect: () => void | (() => void)) => {
      React.useEffect(() => effect(), [effect]);
    },
  };
});

jest.mock('@/services', () => ({
  userService: {
    getProfile: (...args: unknown[]) => mockGetProfile(...args),
  },
  personCategoryService: {
    getMySelectedCategoryIds: (...args: unknown[]) => mockGetMySelectedCategoryIds(...args),
  },
  storageService: {
    getUser: (...args: unknown[]) => mockGetUser(...args),
  },
}));

describe('useUserProfileHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProfile.mockResolvedValue({
      success: true,
      data: {
        name: 'Maria Souza',
        email: 'maria@example.com',
        person: { firstName: 'Maria', lastName: 'Souza' },
        picture: 'https://cdn.example.com/avatar.jpg',
      },
    });
    mockGetMySelectedCategoryIds.mockResolvedValue(['sleep', 'activity', 'nutrition', 'stress', 'smile']);
    mockGetUser.mockResolvedValue(null);
  });

  it('carrega perfil e limita categorias visíveis', async () => {
    const { result } = renderHook(() => useUserProfileHome());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.displayName).toBe('Maria Souza');
    expect(result.current.data.email).toBe('maria@example.com');
    expect(result.current.data.avatarUri).toBe('https://cdn.example.com/avatar.jpg');
    expect(result.current.data.categoryIds).toEqual(['sleep', 'activity', 'nutrition', 'stress']);
    expect(result.current.data.categoryIds).toHaveLength(PROFILE_HOME_MAX_VISIBLE_INTERESTS);
    expect(mockGetMySelectedCategoryIds).toHaveBeenCalled();
  });

  it('retorna categoryIds vazio quando API de categorias falha', async () => {
    mockGetMySelectedCategoryIds.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useUserProfileHome());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.categoryIds).toEqual([]);
    expect(result.current.data.displayName).toBe('Maria Souza');
  });

  it('atualiza avatarUri via setAvatarUri', async () => {
    const { result } = renderHook(() => useUserProfileHome());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setAvatarUri('https://cdn.example.com/new-avatar.jpg');
    });

    await waitFor(() => {
      expect(result.current.data.avatarUri).toBe('https://cdn.example.com/new-avatar.jpg');
    });
  });
});
