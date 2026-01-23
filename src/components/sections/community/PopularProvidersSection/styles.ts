import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    marginTop: SPACING.MD,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: SPACING.MD,
    lineHeight: 18,
    paddingHorizontal: SPACING.MD,
  },
  scrollView: {},
  scrollContent: {
    paddingLeft: SPACING.MD,
    paddingRight: SPACING.MD,
    gap: 4,
  },
  providerItem: {
    alignItems: 'center',
    marginRight: 4,
    width: 74,
  },
  avatarContainer: {
    width: 69,
    height: 64,
    marginBottom: 8,
  },
  avatar: {
    width: 69,
    height: 64,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 69,
    height: 64,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '600',
    color: '#001137',
    fontFamily: 'Bricolage Grotesque',
  },
  providerName: {
    fontSize: 8,
    fontWeight: '400',
    color: '#6e6a6a',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
    width: 86,
    fontFamily: 'DM Sans',
  },
});
