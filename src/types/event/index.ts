import type { ImageSourcePropType } from 'react-native';

/** Evento exibido em cards do feed (ex.: canais / próximos eventos na UI legada). */
export interface FeedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  thumbnail: string;
  participants: EventParticipant[];
  participantsCount: number;
}

export interface EventParticipant {
  id: string;
  avatar?: string;
  name?: string;
  color?: 'Blue' | 'Light Pink' | 'Pink' | 'Green';
}

export type EventBannerStatus = 'Live Now' | 'Scheduled';

export type EventJoinMode = 'zoom_sdk' | 'external_browser' | 'none';

export interface EventBannerData {
  id: string;
  title: string;
  host: string;
  status: EventBannerStatus;
  startTime: string;
  endTime: string;
  thumbnail: ImageSourcePropType | string;
  externalUrl?: string;
  provider?: 'zoom' | 'unknown';
  joinMode?: EventJoinMode;
}

/** Evento retornado pela API (Social Plus / comunidade). */
export interface Event {
  id: string;
  title: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  status: 'scheduled' | 'live' | 'ended' | 'error' | 'unknown';
  provider: 'zoom' | 'unknown';
  externalUrl?: string;
  source: 'social_plus';
  joinMode?: EventJoinMode;
  displayHost?: string;
}

export interface ListEventsApiResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: {
    events?: Event[];
  };
}

export interface EventJoinPayload {
  provider: 'zoom';
  externalUrl: string;
  meetingNumber: string;
  passcode?: string;
  signature: string;
  sdkKey: string;
  role: 0 | 1;
  userName: string;
  userEmail?: string;
}

export interface JoinEventApiResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: EventJoinPayload;
}
