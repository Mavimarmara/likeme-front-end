import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.LG,
  },
  content: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    gap: SPACING.XL,
  },
  userInfo: {
    alignItems: 'center',
    gap: SPACING.MD,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  userDetails: {
    alignItems: 'center',
    gap: SPACING.SM,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(0, 17, 55, 0.7)',
    fontFamily: 'DM Sans',
  },
  userNickname: {
    fontSize: 14,
    color: 'rgba(0, 17, 55, 0.5)',
    fontFamily: 'DM Sans',
  },
  notLoggedIn: {
    padding: SPACING.LG,
    alignItems: 'center',
  },
  notLoggedInText: {
    fontSize: 16,
    color: 'rgba(0, 17, 55, 0.7)',
    fontFamily: 'DM Sans',
  },
  errorContainer: {
    padding: SPACING.MD,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    fontFamily: 'DM Sans',
  },
  logoutContainer: {
    marginTop: SPACING.MD,
  },
});
