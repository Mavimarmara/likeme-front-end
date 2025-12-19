import { StyleSheet, Dimensions } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  weekHighlightCard: {
    width: SCREEN_WIDTH - SPACING.MD * 2,
    height: 200,
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.MD,
  },
  weekHighlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  weekHighlightBadge: {
    position: 'absolute',
    top: SPACING.MD,
    left: SPACING.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
  },
  weekHighlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  weekHighlightContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  weekHighlightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: SPACING.XS,
  },
  weekHighlightPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
