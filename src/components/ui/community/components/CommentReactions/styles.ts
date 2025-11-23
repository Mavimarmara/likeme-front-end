import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  reactionButton: {
    backgroundColor: '#fdfbee', // SECONDARY_LIGHT do design
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 36,
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    borderRadius: BORDER_RADIUS.LG,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  reactionCount: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#001137', // TEXT_DARK do design
    textAlign: 'center',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: SPACING.SM,
    marginRight: -SPACING.SM,
  },
  commentCount: {
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 22,
    color: '#0154f8', // PRIMARY_BLUE do design
    letterSpacing: 0.2,
  },
  toggleButton: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -SPACING.SM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});

