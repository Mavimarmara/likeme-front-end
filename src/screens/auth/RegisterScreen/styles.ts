import { ImageStyle, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '@/constants';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 170,
  },
  topSection: {
    width: '100%',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 64,
    overflow: 'hidden',
    paddingHorizontal: SPACING.MD,
  },
  headerContent: {
    width: '100%',
    paddingBottom: SPACING.XL,
    paddingHorizontal: SPACING.MD,
    gap: 24,
    marginTop: 31,
  },
  titleAdornment: {
    position: 'absolute',
  } as ImageStyle,
  content: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    width: '100%',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.XL,
    paddingBottom: SPACING.LG,
  },
  invitationSection: {
    width: '100%',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  invitationQuestion: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoSection: {
    width: '100%',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: SPACING.XS,
  },
  infoText: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'left',
  },
  fieldsContainer: {
    width: '100%',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f4f3ec',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.LG,
  },
  buttonGroup: {
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
});
