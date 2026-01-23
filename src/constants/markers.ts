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
  activity: ['#B7CFFF', '#0154F8', '#003EB8', '#003191'] as const,
  connection: ['#FFEABC', '#F6DEA9', '#DFC488', '#BA9F62'] as const,
  environment: ['#d8e4d6', '#8F988E', '#767D75'] as const,
  nutrition: ['#E0F431', '#C3D714', '#AFC211', '#96A60C'] as const,
  'purpose-vision': ['#D3BE15', '#A6950B', '#90820F', '#675D08'] as const,
  'self-esteem': ['#F6DEA9', '#C4B179', '#8E7A3F'] as const,
  sleep: ['#E3DBF2', '#958AAA', '#706683', '#655C74'] as const,
  smile: ['#FCE3FF', '#F6CFFB', '#EE8AFB', '#E760F9'] as const,
  spirituality: ['#F6CFFB', '#EB7DC6', '#E23BAA', '#DC1499'] as const,
  stress: ['#FFAB76', '#FF6300', '#D85400', '#C24B00'] as const,
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

