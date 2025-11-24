import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: SPACING.XXL,
  },
  selectorContainer: {
    zIndex: 10,
    alignSelf: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  detailsContent: {
    paddingBottom: SPACING.XXL,
    paddingTop: SPACING.LG,
    alignItems: 'center',
    gap: SPACING.XL * 2,
  },
  programHeader: {
    alignItems: 'flex-start',
    width: 331,
    alignSelf: 'center',
    gap: SPACING.MD,
  },
  programTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#001137',
    lineHeight: 32,
    marginBottom: 16,
  },
  descriptionContainer: {
    width: '100%',
  },
  programDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#001137',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  modulesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXL,
    paddingHorizontal: SPACING.MD,
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
});

