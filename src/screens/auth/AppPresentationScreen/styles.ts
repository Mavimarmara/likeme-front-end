import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.XL,
  },

  body: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },

  imageContainer: {
    alignItems: 'center',
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  image: {
    borderRadius: BORDER_RADIUS.LG,
  },
  imageSvgWrapper: {
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  content: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: 0,
    flexShrink: 1,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '500',
    color: COLORS.TEXT,
    textAlign: 'left',
    marginBottom: SPACING.MD,
    lineHeight: 20,
  },
  description: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    textAlign: 'left',
    lineHeight: 24,
  },
  descriptionBold: {
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  stepIndicatorSpacer: {
    width: 50,
  },
  stepIndicator: {
    flex: 1,
    fontSize: FONT_SIZES.MD,
    fontWeight: '700',
    color: COLORS.TEXT,
    textAlign: 'center',
  },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topActions: {
    position: 'absolute',
    top: SPACING.MD,
    right: SPACING.LG,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    zIndex: 10,
  },
});
