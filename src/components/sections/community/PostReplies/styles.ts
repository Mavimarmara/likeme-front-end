import { COLORS } from '@/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: COLORS.SECONDARY.PURE,
  },
  stateContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: COLORS.SECONDARY.PURE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  stateLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  errorLabel: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  retryButtonLabel: {
    fontSize: 14,
    color: COLORS.PRIMARY.PURE,
    fontWeight: '600',
  },
  inlineLoadingRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
