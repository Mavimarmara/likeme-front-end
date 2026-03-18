import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  header: {
    marginBottom: SPACING.MD,
    backgroundColor: 'rgba(251, 247, 229, 0.92)',
    borderRadius: 22,
    padding: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    marginBottom: SPACING.XS,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_LIGHT,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  overline: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: COLORS.TEXT_LIGHT,
    letterSpacing: 0.5,
    marginBottom: SPACING.XS,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.TEXT,
    lineHeight: 26,
  },
});
