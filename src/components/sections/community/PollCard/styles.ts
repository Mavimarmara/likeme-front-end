import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.MD,
  },
  optionsContainer: {
    gap: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  option: {
    gap: SPACING.SM,
    paddingLeft: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.MD,
  },
  optionSelected: {
    backgroundColor: '#fbf7e5',
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.SM,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#001137',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#0154f8',
    borderWidth: 2,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0154f8',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#001137',
    letterSpacing: 0.2,
    flex: 1,
    lineHeight: 14,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6e6a6a',
    letterSpacing: 0.2,
    lineHeight: 14,
    minWidth: 50,
    textAlign: 'right',
  },
  optionTextSelected: {
    color: '#0154f8',
    fontWeight: '600',
  },
  percentageSelected: {
    color: '#0154f8',
    fontWeight: '600',
  },
  progressContainer: {
    height: 12,
    position: 'relative',
    width: '100%',
  },
  progressBarBackground: {
    position: 'absolute',
    height: 12,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 13,
  },
  progressBarFill: {
    position: 'absolute',
    height: 12,
    backgroundColor: '#d8e4d6',
    borderRadius: 13,
  },
  progressBarFillSelected: {
    backgroundColor: '#0154f8',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0154f8',
    lineHeight: 12,
  },
});
