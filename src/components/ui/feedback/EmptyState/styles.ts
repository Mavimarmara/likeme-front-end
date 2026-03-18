import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

const TITLE_COLOR = '#15293B';
const DESCRIPTION_COLOR = '#46596E';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
  },
  iconWrapper: {
    marginBottom: SPACING.LG,
  },
  icon: {
    opacity: 0.7,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TITLE_COLOR,
    textAlign: 'center',
    marginBottom: SPACING.MD,
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: DESCRIPTION_COLOR,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: SPACING.MD,
  },
  actionButton: {
    alignSelf: 'stretch',
    borderRadius: 24,
  },
});
