import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
  },
  
  // Variants
  default: {
    backgroundColor: COLORS.WHITE,
  },
  elevated: {
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outlined: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  // Header
  header: {
    marginBottom: SPACING.SM,
  },
  
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
  },
  
  // Content
  content: {
    flex: 1,
  },
});
