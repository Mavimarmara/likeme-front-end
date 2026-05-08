import { renderHook, act } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { useEventJoin } from '@/hooks/event/useEventJoin';

describe('useEventJoin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handleEventBannerPress com Zoom abre no app/browser externo', async () => {
    const { result } = renderHook(() => useEventJoin());

    await act(async () => {
      await result.current.handleEventBannerPress({
        id: '1',
        title: 'Evento',
        host: 'Host',
        status: 'Live Now',
        startTime: '',
        endTime: '',
        thumbnail: '',
        externalUrl: 'https://us02web.zoom.us/j/123456789',
      } as Parameters<typeof result.current.handleEventBannerPress>[0]);
    });

    expect(Linking.openURL).toHaveBeenCalledWith('https://us02web.zoom.us/j/123456789');
    expect(result.current.eventJoinUrl).toBeNull();
  });

  it('closeEventSession limpa URL da sessão', async () => {
    const { result } = renderHook(() => useEventJoin());

    await act(async () => {
      await result.current.handleEventBannerPress({
        id: '1',
        title: 'Evento',
        host: 'Host',
        status: 'Live Now',
        startTime: '',
        endTime: '',
        thumbnail: '',
        externalUrl: 'https://us02web.zoom.us/j/123456789',
      } as Parameters<typeof result.current.handleEventBannerPress>[0]);
    });
    act(() => {
      result.current.closeEventSession();
    });

    expect(result.current.eventJoinUrl).toBeNull();
  });

  it('handleEventBannerPress com external_browser usa Linking.openURL', async () => {
    const { result } = renderHook(() => useEventJoin());

    await act(async () => {
      await result.current.handleEventBannerPress({
        id: '1',
        title: 'Evento',
        host: 'Host',
        status: 'Live Now',
        startTime: '',
        endTime: '',
        thumbnail: '',
        externalUrl: 'https://example.com/evento',
        joinMode: 'external_browser',
      } as Parameters<typeof result.current.handleEventBannerPress>[0]);
    });

    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/evento');
    expect(result.current.eventJoinUrl).toBeNull();
  });
});
