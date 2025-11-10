import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

const { width, height } = Dimensions.get('window');

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
  },

  imageContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.XL,
    position: 'relative',
  },
  image: {
    width: width - SPACING.MD * 2,
    height: height * 0.55,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.XS,
  },

  pagination: {
    position: 'absolute',
    top: 0,
    left: SPACING.MD,
    right: SPACING.MD,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XS,
    pointerEvents: 'none',
  },
  paginationAligned: {
    height: height * 1.12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.PRIMARY,
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },

  content: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    flexGrow: 1,
    justifyContent: 'center',
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

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  skipButton: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
  },
  skipButtonDisabled: {
    opacity: 0.5,
  },
  skipText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    textDecorationLine: 'underline',
  },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  nextButtonDisabled: {
    opacity: 0.6,
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
