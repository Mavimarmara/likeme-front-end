import React, { useEffect, useRef } from 'react';
import { ZoomSDKProvider, useZoom } from '@zoom/meetingsdk-react-native';
import type { EventJoinPayload } from '@/types/event';
import { logger } from '@/utils/logger';

const SDK_INIT_MAX_ATTEMPTS = 80;
const SDK_INIT_POLL_MS = 50;

export interface ZoomSdkMeetingSessionProps {
  payload: EventJoinPayload;
  onOpened: () => void;
  onFailure: (error: Error) => void;
}

const waitForSdkInitialized = async (
  isInitialized: () => Promise<boolean>,
  isCancelled: () => boolean,
): Promise<boolean> => {
  for (let attempt = 0; attempt < SDK_INIT_MAX_ATTEMPTS; attempt++) {
    if (isCancelled()) {
      return false;
    }
    const ready = await isInitialized();
    if (ready) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, SDK_INIT_POLL_MS));
  }
  return false;
};

const ZoomJoinExecutor: React.FC<ZoomSdkMeetingSessionProps> = ({ payload, onOpened, onFailure }) => {
  const zoom = useZoom();
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const onOpenedRef = useRef(onOpened);
  const onFailureRef = useRef(onFailure);

  onOpenedRef.current = onOpened;
  onFailureRef.current = onFailure;

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    const run = async () => {
      try {
        const initialized = await waitForSdkInitialized(() => zoomRef.current.isInitialized(), isCancelled);
        if (!initialized || cancelled) {
          if (!cancelled) {
            onFailureRef.current(new Error('Zoom SDK não inicializou a tempo'));
          }
          return;
        }

        const joinResult = await zoomRef.current.joinMeeting({
          userName: payload.userName,
          meetingNumber: payload.meetingNumber,
          password: payload.passcode,
        });

        if (cancelled) {
          return;
        }

        if (joinResult !== 0) {
          onFailureRef.current(new Error(`Falha ao entrar na reunião (código ${joinResult})`));
          return;
        }

        onOpenedRef.current();
      } catch (error: unknown) {
        if (!cancelled) {
          const err = error instanceof Error ? error : new Error(String(error));
          logger.error('[ZoomSdkMeetingSession] joinMeeting falhou', { cause: err });
          onFailureRef.current(err);
        }
      }
    };

    run().catch((error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('[ZoomSdkMeetingSession] execução join interrompida', { cause: err });
    });

    return () => {
      cancelled = true;
    };
  }, [payload.meetingNumber, payload.passcode, payload.userName]);

  return null;
};

export const ZoomSdkMeetingSession: React.FC<ZoomSdkMeetingSessionProps> = ({ payload, onOpened, onFailure }) => {
  return (
    <ZoomSDKProvider
      config={{
        jwtToken: payload.signature,
        domain: 'zoom.us',
        enableLog: __DEV__,
        logSize: 5,
      }}
    >
      <ZoomJoinExecutor payload={payload} onOpened={onOpened} onFailure={onFailure} />
    </ZoomSDKProvider>
  );
};
