import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useEventJoin } from '@/hooks/event/useEventJoin';
import { eventService } from '@/services';

describe('useEventJoin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('onZoomMeetingFailed limpa payload, encerra busy e exibe alerta', () => {
    jest
      .spyOn(eventService, 'requestZoomJoinPayload')
      .mockReturnValue(new Promise(() => {}) as ReturnType<typeof eventService.requestZoomJoinPayload>);

    const { result } = renderHook(() => useEventJoin());

    act(() => {
      void result.current.handleEventBannerPress({
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

    expect(result.current.eventJoinBusy).toBe(true);

    act(() => {
      result.current.onZoomMeetingFailed(new Error('join falhou'));
    });

    expect(result.current.eventJoinPayload).toBeNull();
    expect(result.current.eventJoinBusy).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(expect.any(String), 'join falhou');
  });

  it('handleEventBannerPress com Zoom chama requestZoomJoinPayload e define payload', async () => {
    jest.spyOn(eventService, 'requestZoomJoinPayload').mockResolvedValue({
      success: true,
      data: {
        provider: 'zoom',
        externalUrl: 'https://us02web.zoom.us/j/123456789',
        meetingNumber: '123456789',
        signature: 'sig',
        sdkKey: 'key',
        role: 0,
        userName: 'User',
      },
    });

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

    expect(eventService.requestZoomJoinPayload).toHaveBeenCalledWith('https://us02web.zoom.us/j/123456789');
    expect(result.current.eventJoinPayload?.meetingNumber).toBe('123456789');
    expect(result.current.eventJoinBusy).toBe(true);

    act(() => {
      result.current.onZoomMeetingOpened();
    });
    expect(result.current.eventJoinBusy).toBe(false);
  });
});
