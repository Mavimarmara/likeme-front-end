import { StyleSheet, ViewStyle } from 'react-native';
import type { AnimatableNumericValue } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: SPACING.SM,
    flex: 1,
    minHeight: 100,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: SPACING.SM,
    paddingBottom: 0,
  },
  topSection: {
    paddingHorizontal: SPACING.SM,
  },
  footerSection: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.SM,
    gap: SPACING.SM,
  },
  footerContent: {
    position: 'relative',
    zIndex: 1,
    gap: SPACING.SM,
  },
});

export const getBlurStyle = (footerHeight: number, borderRadius: ViewStyle['borderRadius']): ViewStyle => {
  const radius = typeof borderRadius === 'number' 
    ? borderRadius 
    : (typeof borderRadius === 'string' ? parseFloat(borderRadius) || 22 : 22);
  
  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: footerHeight > 0 ? footerHeight : undefined,
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  };
};

export const getFooterSectionStyle = (borderRadius: ViewStyle['borderRadius']): ViewStyle => {
  const radius = typeof borderRadius === 'number' 
    ? borderRadius 
    : (typeof borderRadius === 'string' ? parseFloat(borderRadius) || 22 : 22);
  
  return {
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  };
};

