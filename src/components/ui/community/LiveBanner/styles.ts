import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 140,
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  liveButton: {
    position: 'absolute',
    bottom: SPACING.SM,
    left: SPACING.SM,
    right: SPACING.SM,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveButtonText: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#FFFACD', // Light yellow background
    padding: SPACING.MD,
    justifyContent: 'space-between',
  },
  cameraIcon: {
    marginBottom: SPACING.XS,
  },
  title: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
    lineHeight: 20,
  },
  host: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.XS,
  },
  time: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
});

