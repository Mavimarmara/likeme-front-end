export const mapUICategoryToApiCategory = (uiCategory: string): string | undefined => {
  if (uiCategory === 'all') {
    return undefined;
  }

  if (uiCategory === 'products') {
    return 'physical product';
  }

  if (uiCategory === 'programs') {
    return 'program';
  }

  return undefined;
};
