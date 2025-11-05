import { StyleSheet, Dimensions } from 'react-native';
import { SPACING } from '@/constants';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ec',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    position: 'relative',
    width: 362,
    alignSelf: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.LG,
  },
  titleAdornment: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.3 }],
    marginBottom: 5,
  },
  question: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    width: '100%',
  },
  chipsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
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

