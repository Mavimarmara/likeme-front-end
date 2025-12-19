import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.XL,
  },
  avatarContainer: {
    marginBottom: SPACING.MD,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  providerName: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  providerTitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.SM,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  ratingText: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
  descriptionText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    lineHeight: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  specialtyBadge: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.FULL,
  },
  specialtyText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: SPACING.MD,
    marginTop: SPACING.LG,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.SM,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
});
