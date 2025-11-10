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
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: BORDER_RADIUS.LG,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
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
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: SPACING.MD,
    lineHeight: 32,
  },
  description: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    textAlign: 'center',
    lineHeight: 24,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG
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
