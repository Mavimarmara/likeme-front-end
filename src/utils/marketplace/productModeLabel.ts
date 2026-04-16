import type { Product } from '@/types/product';

function normalizeModeCode(modeCode?: string | null): string | null {
  if (!modeCode) {
    return null;
  }

  const normalized = modeCode.trim().toLowerCase();
  return normalized || null;
}

export function getProductModeTranslationKey(product?: Product | null): string | null {
  if (!product) {
    return null;
  }

  const modeCodeFromModes = product.modes?.find((entry) => entry?.mode?.code?.trim())?.mode?.code?.trim();
  if (modeCodeFromModes) {
    return normalizeModeCode(modeCodeFromModes);
  }

  const modeCode = product.modeCodes?.find((entry) => entry?.trim())?.trim();
  if (modeCode) {
    return normalizeModeCode(modeCode);
  }

  return null;
}
