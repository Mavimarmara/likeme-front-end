import { StyleSheet, Dimensions } from 'react-native';
import { SPACING } from '@/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  section: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    position: 'relative',
  },
  /** Container para cardContent (ex.: card de produto no canto inferior direito) */
  cardContainer: {
    position: 'absolute',
    bottom: SPACING.LG,
    right: SPACING.MD,
    left: SPACING.MD,
    alignItems: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageStyle: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 327,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    zIndex: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(0, 17, 55, 0.64)',
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 16,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#f6dea9',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
