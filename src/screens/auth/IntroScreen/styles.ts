import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    justifyContent: 'space-between',
  },

  // Greeting Section
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: SPACING.XXL,
  },
  titleAdornment: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.5 }],
    marginBottom: 5,
  },
  greetingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
  welcomeText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT,
    fontWeight: '400',
    marginBottom: SPACING.SM,
  },
  questionText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT,
    fontWeight: '400',
  },

  // Button Section
  buttonContainer: {
    paddingBottom: SPACING.XXL,
  },
  primaryButton: {
    backgroundColor: COLORS.BLACK,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  primaryButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BLACK,
  },
  secondaryButtonText: {
    color: COLORS.TEXT,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    textAlign: 'center',
  },
});
