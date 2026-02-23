import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    width: 170,
    gap: SPACING.SM,
  },
  imageContainer: {
    width: 170,
    height: 164,
    borderRadius: 22,
  },
  tagBadge: {
    backgroundColor: 'rgba(0, 17, 55, 0.64)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 0,
    minHeight: 24,
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#d8e4d6',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.XS,
  },
  price: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  likesCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f6cffb',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: SPACING.XS,
    paddingRight: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#001137',
    letterSpacing: 0.2,
    flex: 1,
  },
});
