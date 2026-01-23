export const APP_CONFIG = {
  NAME: 'LIKE:ME',
  TAGLINE: 'LIKE YOUR LIFE',
  VERSION: '1.0.0',
} as const;

export const COLORS = {
  PRIMARY: {
    PURE: '#0154F8',
    LIGHT: '#D8E4D6',
    MEDIUM: '#8FA3A1',
  },
  SECONDARY: {
    LIGHT: '#FDFBEE',
    PURE: '#FBF7E5',
    MEDIUM: '#E1DFCF',
    DARK: '#CCCABC',
  },
  HIGHLIGHT: {
    PURE: '#C3D714',
    LIGHT: '#EDEC80',
    MEDIUM: '#B3B26D',
    DARK: '#8F8104',
  },
  NEUTRAL: {
    HIGH: {
      LIGHT: '#FFFFFF',
      PURE: '#F4F3EC',
      DARK: '#958AAA',
    },
    LOW: {
      PURE: '#001137',
      LIGHT: '#D9D9D9',
      MEDIUM: '#B2B2B2',
      DARK: '#6E6A6A',
    },
  },
  FEEDBACK: {
    WARNING: '#E30F3C',
    NOTIFICATION_PURE: '#FC8B5C',
  },
  BACKGROUND: '#F4F3EC',
  BACKGROUND_SECONDARY: '#FBF7E5',
  TEXT: '#001137',
  TEXT_LIGHT: '#6E6A6A',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  SUCCESS: '#C3D714',
  ERROR: '#E30F3C',
  WARNING: '#E30F3C',
  INFO: '#0154F8',
} as const;

export const GRADIENTS = {
  PINK: '#FFB6C1',
  YELLOW: '#FFD700',
  GREEN: '#32CD32',
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 32,
  XXXL: 36,
} as const;

export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  ROUND: 50,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
