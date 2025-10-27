import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XL,
    backgroundColor: COLORS.PRIMARY,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  form: {
    padding: SPACING.LG,
  },
  inputGroup: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    backgroundColor: COLORS.WHITE,
  },
  registerButton: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
  },
  loginLinkText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});
