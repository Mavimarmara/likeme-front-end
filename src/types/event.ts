export interface Event {
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

