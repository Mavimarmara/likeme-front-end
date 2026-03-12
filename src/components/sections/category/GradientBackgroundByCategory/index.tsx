import React from 'react';
import { getCategoryGradient, type CategoryName } from '@/constants/categoryColors';
import { DEFAULT_BACKGROUND_GRADIENT } from '@/constants';
import { GradientBackground } from '@/components/ui/layout';

type Props = {
  category: CategoryName;
};

const GradientBackgroundByCategory: React.FC<Props> = ({ category }) => {
  const categoryGradient = getCategoryGradient(category);
  const colors = categoryGradient ?? DEFAULT_BACKGROUND_GRADIENT;
  const useVertical = category === 'all';

  return (
    <GradientBackground colors={colors} {...(useVertical ? {} : { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } })} />
  );
};

export default GradientBackgroundByCategory;
