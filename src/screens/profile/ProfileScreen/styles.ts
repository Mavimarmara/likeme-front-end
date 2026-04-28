import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: SPACING.MD,
  },
  deleteAccountHint: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0, 17, 55, 0.65)',
    fontFamily: 'DM Sans',
  },
  deleteAccountButton: {
    borderWidth: 1,
    borderColor: '#c62828',
    borderRadius: 8,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  deleteAccountButtonDisabled: {
    opacity: 0.6,
  },
  deleteAccountButtonLabel: {
    color: '#c62828',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  webDeletionLinkText: {
    fontSize: 14,
    color: 'rgba(0, 17, 55, 0.85)',
    textDecorationLine: 'underline',
    fontFamily: 'DM Sans',
  },
});
