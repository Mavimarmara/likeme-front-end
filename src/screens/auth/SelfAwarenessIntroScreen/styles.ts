import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '@/constants';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: 60,
    paddingBottom: SPACING.XXL,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },
  title: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'Bricolage Grotesque',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  subtitle: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
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

