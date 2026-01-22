export type AvatarSize = 'XXS' | 'XS' | 'S' | 'L' | 'XL' | 'XXL';

export interface AvatarDimensions {
  width: number;
  height: number;
}

const SIZE_DIMENSIONS: Record<AvatarSize, AvatarDimensions> = {
  XXS: { width: 30, height: 26 },
  XS: { width: 45, height: 41 },
  S: { width: 60, height: 54 },
  L: { width: 75, height: 68 },
  XL: { width: 90, height: 81 },
  XXL: { width: 105, height: 95 },
};

export const getAvatarSizeFromPercentage = (percentage: number): AvatarSize => {
  if (percentage === 0) return 'XXS';
  if (percentage <= 16) return 'XS';
  if (percentage <= 33) return 'S';
  if (percentage <= 50) return 'L';
  if (percentage <= 66) return 'XL';
  return 'XXL';
};

export const getAvatarDimensions = (size: AvatarSize): AvatarDimensions => {
  return SIZE_DIMENSIONS[size];
};

