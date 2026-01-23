export const MARKER_COLORS = {
  activity: '#0154F8',
  connection: '#8A2BE2',
  environment: '#32CD32',
  nutrition: '#FFD700',
  'purpose-vision': '#6B8E23',
  'self-esteem': '#D2B48C',
  sleep: '#9370DB',
  smile: '#FF69B4',
  spirituality: '#FF1493',
  stress: '#FF4500',
} as const;

export const MARKER_GRADIENTS: Record<string, readonly [string, string, ...string[]]> = {
  connection: ['#D2B48C', '#8A2BE2'] as const,
  environment: ['#87CEEB', '#32CD32'] as const,
  'purpose-vision': ['#6B8E23', '#8B7355'] as const,
  'self-esteem': ['#F5DEB3', '#D2B48C'] as const,
  sleep: ['#9370DB', '#87CEEB'] as const,
  stress: ['#FF4500', '#FF6B6B'] as const,
} as const;

export type MarkerId = keyof typeof MARKER_COLORS;

export const getMarkerColor = (markerId: string): string => {
  const normalizedId = markerId.toLowerCase().replace(/\s+/g, '-') as MarkerId;
  return MARKER_COLORS[normalizedId] || '#001137';
};

export const getMarkerGradient = (markerId: string): readonly [string, string, ...string[]] | null => {
  const normalizedId = markerId.toLowerCase().replace(/\s+/g, '-');
  return MARKER_GRADIENTS[normalizedId] || null;
};

export const hasMarkerGradient = (markerId: string): boolean => {
  return getMarkerGradient(markerId) !== null;
};

