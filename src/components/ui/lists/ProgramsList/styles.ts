import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectorContainer: {
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  detailsContent: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XXL,
    paddingTop: SPACING.MD,
  },
  programHeader: {
    marginBottom: 48,
    alignItems: 'flex-end',
    width: 331,
    alignSelf: 'center',
  },
  programTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#001137',
    lineHeight: 32,
    marginBottom: 16,
  },
  descriptionContainer: {
    width: 330,
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

