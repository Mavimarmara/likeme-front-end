import { renderHook } from '@testing-library/react-native';
import { useUser } from '@/hooks/user/useUser';
import publicUserService from '@/services/user/publicUserService';
import { storageService } from '@/services';

jest.mock('@/services/user/publicUserService', () => ({
  __esModule: true,
  default: {
    getPublicUser: jest.fn(),
  },
}));

jest.mock('@/services', () => ({
  storageService: {
    getUser: jest.fn(),
  },
}));

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(storageService.getUser).mockResolvedValue({
      email: 'a@b.c',
      name: 'Maria Souza',
      picture: 'https://cdn.example.com/me.jpg',
    });
  });

  it('getPublicUser retorna dados do storage para me', async () => {
    const { result } = renderHook(() => useUser());
    const user = await result.current.getPublicUser('me');

    expect(user.name).toBe('Maria Souza');
    expect(user.avatar).toBe('https://cdn.example.com/me.jpg');
    expect(publicUserService.getPublicUser).not.toHaveBeenCalled();
  });

  it('getPublicUser consulta a API com userId do comentário', async () => {
    jest.mocked(publicUserService.getPublicUser).mockResolvedValue({
      name: 'Marco Moreira',
      username: 'marco',
      avatar: 'https://cdn.example.com/marco.jpg',
    });

    const { result } = renderHook(() => useUser());
    const user = await result.current.getPublicUser('google-oauth2|1');

    expect(user).toEqual({
      name: 'Marco Moreira',
      username: 'marco',
      avatar: 'https://cdn.example.com/marco.jpg',
    });
    expect(publicUserService.getPublicUser).toHaveBeenCalledWith('google-oauth2|1');
  });
});
