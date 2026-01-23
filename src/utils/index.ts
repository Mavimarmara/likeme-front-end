import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenUtils = {
  width,
  height,
  isSmallDevice: width < 375,
  isTablet: width >= 768,
};

export const dateUtils = {
  formatDate: (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  },

  formatTime: (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatDateTime: (date: Date): string => {
    return `${dateUtils.formatDate(date)} ${dateUtils.formatTime(date)}`;
  },

  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isYesterday: (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  },
};

export const stringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  },
};

export const numberUtils = {
  formatCurrency: (amount: number, currency: string = 'BRL'): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatNumber: (num: number): string => {
    return new Intl.NumberFormat('pt-BR').format(num);
  },

  roundToDecimals: (num: number, decimals: number = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
};

export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  },

  isValidCPF: (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
  },
};

export const storageUtils = {
  getItem: async (key: string): Promise<string | null> => {
    return null;
  },

  setItem: async (key: string, value: string): Promise<void> => {},

  removeItem: async (key: string): Promise<void> => {},
};

// Core utilities
export * from './logger';
export * from './navigation';

// Formatters
export * from './formatters/priceFormatter';
export * from './formatters/dateFormatter';
export * from './formatters/inputFormatters';
export * from './formatters/addressFormatter';

// Sorters
export * from './sorters/dateTimeSorter';

// Mappers
export * from './mappers/productMapper';
export * from './mappers/cartMapper';
export * from './mappers/eventMapper';
export * from './mappers/categoryMapper';

// Community utilities
export * from './community/filterMapper';
export * from './community/mappers';

// Anamnesis utilities
export * from './anamnesis/avatarSizeMapper';
