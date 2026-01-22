import { StyleSheet } from 'react-native';
import { FONT_SIZES, SPACING, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: SPACING.MD,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.TEXT,
    marginBottom: SPACING.LG,
    textAlign: 'center',
  },
  avatarsContainer: {
    alignItems: 'center',
    opacity: 0.4,
  },
  avatarsContainerActive: {
    opacity: 1,
  },
  avatarItem: {
    alignItems: 'center',
  },
  avatarLabel: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XS,
    fontWeight: '500',
    color: COLORS.TEXT,
    textAlign: 'center',
    width: 280,
  },
  mindAvatar: {
    // Dimensões serão definidas dinamicamente via props
  },
  bodyAvatar: {
    // Dimensões serão definidas dinamicamente via props
  },
});

