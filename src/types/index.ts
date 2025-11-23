export * from './navigation';
export * from './community';
export * from './auth';
export * from './person';
export * from './infrastructure';
export * from './personalObjectives';
export * from './event';
export * from './program';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthMetric {
  id: string;
  userId: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'temperature';
  value: number;
  unit: string;
  recordedAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'meditation' | 'nutrition' | 'sleep';
  duration?: number;
  completedAt?: Date;
  userId: string;
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  steps: ProtocolStep[];
  duration: number;
  userId: string;
}

export interface ProtocolStep {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endedAt?: Date;
  isFinished: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  commentsCount?: number;
  createdAt: Date;
  category?: string;
  tags?: string | string[];
  overline?: string;
  title?: string;
  userName?: string;
  userAvatar?: string;
  poll?: Poll;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  userName?: string;
  userAvatar?: string;
}

export interface HealthProvider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  avatar?: string;
  availableSlots: Date[];
}
