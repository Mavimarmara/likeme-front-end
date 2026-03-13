export const mapUICategoryToApiCategory = (uiCategory: string): string | undefined => {
  if (uiCategory === 'all') {
    return undefined;
  }

  if (uiCategory === 'products') {
    return 'physical product';
  }

  if (uiCategory === 'specialists') {
    return 'program';
  }

  if (uiCategory === 'programs') {
    return 'program';
  }

  if (uiCategory === 'services') {
    return undefined;
  }

  return undefined;
};
