import { COLORS, SPACING } from '@/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  scrollContentContainer: {
    flexGrow: 1,
    width: 362,
    alignSelf: 'center',
    paddingTop: 60,
    paddingVertical: SPACING.LG,
  },

  main: {
    flexGrow: 1,
    width: '100%',
  },

  content: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
    position: 'relative',
    width: '100%',
  },

  welcomeTitleBlock: {
    width: '100%',
  },

  welcomeTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  },

  welcomeTitleText: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'Bricolage Grotesque',
    fontWeight: '700',
    letterSpacing: -2,
    textAlign: 'left',
    transform: [{ scaleX: 0.92 }],
    marginLeft: -SPACING.MD,
  },

  welcomeTitleLarge: {
    fontSize: 48,
    lineHeight: 48,
  },

  welcomeTitleImage: {
    height: 100,
    width: 200,
    position: 'relative',
    marginHorizontal: -55,
    marginRight: -20,
    marginVertical: -20,
  },

  welcomeSubtitle: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 25,
  },

  titleAdornment: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.3 }],
    marginBottom: 5,
  },

  inputSection: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: SPACING.XXL,
    width: '100%',
  },

  inputContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
  },

  footer: {
    width: '100%',
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XXL,
  },
});
