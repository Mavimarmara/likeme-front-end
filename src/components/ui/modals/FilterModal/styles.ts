import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

const COLORS = {
  TEXT_DARK: '#001137',
  TEXT_LIGHT: '#666666',
  BORDER: '#b2b2b2',
};

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: SPACING.MD,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.SM,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  authorInput: {
    backgroundColor: 'rgba(240, 238, 225, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: SPACING.MD,
    minHeight: 36,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT_DARK,
  },
});
