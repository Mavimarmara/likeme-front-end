import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ec',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
    paddingHorizontal: 0,
  },
  stepperItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#001137',
    marginBottom: SPACING.XS,
  },
  stepperLabelActive: {
    color: '#001137',
  },
  stepperLabelInactive: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#b2b2b2',
    marginBottom: SPACING.XS,
  },
  stepperLine: {
    height: 2,
    width: 105,
  },
  stepperLineActive: {
    backgroundColor: '#0154f8',
  },
  stepperLineInactive: {
    height: 2,
    width: 100,
    backgroundColor: '#b2b2b2',
  },
  paymentMethodSection: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#000000',
    marginBottom: SPACING.SM,
  },
  paymentMethodOptions: {
    flexDirection: 'row',
    gap: SPACING.XL,
    marginTop: SPACING.SM,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#001137',
    backgroundColor: '#fdfbee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#0154f8',
    backgroundColor: '#fdfbee',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0154f8',
  },
  paymentMethodLabel: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#000000',
  },
  cardForm: {
    marginBottom: SPACING.LG,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 21,
    marginTop: SPACING.SM,
  },
  cardFieldHalf: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    marginTop: SPACING.MD,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#001137',
    backgroundColor: '#fdfbee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#0154f8',
    backgroundColor: '#fdfbee',
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.XS,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#6e6a6a',
  },
  couponSection: {
    paddingVertical: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  couponRow: {
    flexDirection: 'row',
    gap: SPACING.XS,
    marginTop: SPACING.SM,
    alignItems: 'flex-end',
  },
  couponInput: {
    flex: 1,
  },
  couponInputField: {
    height: 42,
  },
  applyButton: {
    backgroundColor: '#001137',
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    borderRadius: 18,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  orderSummary: {
    marginTop: SPACING.LG,
  },
  separator: {
    height: 1,
    backgroundColor: '#e1dfcf',
    marginVertical: SPACING.SM,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.XS,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 0.2,
  },
  summaryValue: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 0.2,
  },
  summaryTotalLabel: {
    fontWeight: '500',
  },
  summaryTotalValue: {
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.MD,
    paddingTop: SPACING.SM,
  },
  completeButton: {
    backgroundColor: 'rgba(240, 238, 225, 0.16)',
    borderWidth: 1,
    borderColor: '#001137',
    borderRadius: 24,
    paddingVertical: SPACING.SM + 4,
    paddingHorizontal: SPACING.MD,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#001137',
    textAlign: 'center',
  },
});
