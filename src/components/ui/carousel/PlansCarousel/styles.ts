import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d8e4d6',
    borderRadius: 64,
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.XXL,
    paddingBottom: SPACING.XL,
    marginTop: SPACING.XL,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#001137',
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6e6a6a',
    lineHeight: 19.3,
  },
  carouselContainer: {
    paddingVertical: SPACING.SM,
  },
});

