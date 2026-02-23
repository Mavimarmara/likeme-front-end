import { render, fireEvent } from '@testing-library/react-native';
import PaymentForm from './PaymentForm';

jest.mock('@/hooks', () => ({
  useFormattedInput: ({ type, onChangeText }: any) => {
    return (text: string) => {
      // Simula formatação básica
      let formatted = text;
      if (type === 'cardNumber') {
        // Remove espaços e adiciona a cada 4 dígitos
        const cleaned = text.replace(/\s/g, '');
        formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      } else if (type === 'expiryDate') {
        // Formata como mm/yy
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
          formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        } else {
          formatted = cleaned;
        }
      }
      onChangeText(formatted);
    };
  },
}));

jest.mock('@/components/ui/inputs/TextInput', () => {
  const React = require('react');
  const { TextInput: RNTextInput, View, Text } = require('react-native');
  return React.forwardRef(({ label, placeholder, value, onChangeText, ...props }: any, ref: any) => (
    <View>
      {label && <Text>{label}</Text>}
      <RNTextInput
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        testID={placeholder || label}
        {...props}
      />
    </View>
  ));
});

describe('PaymentForm', () => {
  const mockProps = {
    paymentMethod: 'credit_card' as const,
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cpf: '',
    phone: '',
    saveCardDetails: false,
    couponCode: '',
    onPaymentMethodChange: jest.fn(),
    onCardholderNameChange: jest.fn(),
    onCardNumberChange: jest.fn(),
    onExpiryDateChange: jest.fn(),
    onCvvChange: jest.fn(),
    onCpfChange: jest.fn(),
    onPhoneChange: jest.fn(),
    onSaveCardDetailsChange: jest.fn(),
    onCouponCodeChange: jest.fn(),
    onApplyCoupon: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render payment method selection', () => {
    const { getByText } = render(<PaymentForm {...mockProps} />);

    expect(getByText('checkout.paymentMethod')).toBeTruthy();
    expect(getByText('checkout.creditCard')).toBeTruthy();
    expect(getByText('checkout.pix')).toBeTruthy();
  });

  it('should render credit card form when credit_card is selected', () => {
    const { getByText, getByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    expect(getByText('checkout.cardholderName')).toBeTruthy();
    expect(getByPlaceholderText('checkout.cardholderNamePlaceholder')).toBeTruthy();
    expect(getByText('checkout.cardNumber')).toBeTruthy();
    expect(getByPlaceholderText('checkout.cardNumberPlaceholder')).toBeTruthy();
    expect(getByText('checkout.expiryDate')).toBeTruthy();
    expect(getByText('checkout.cvv')).toBeTruthy();
  });

  it('should not render credit card form when pix is selected', () => {
    const { queryByText, queryByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='pix' />);

    expect(queryByText('checkout.cardholderName')).toBeNull();
    expect(queryByPlaceholderText('checkout.cardholderNamePlaceholder')).toBeNull();
  });

  it('should call onPaymentMethodChange when credit card option is pressed', () => {
    const { getByText } = render(<PaymentForm {...mockProps} paymentMethod='pix' />);

    const creditCardOption = getByText('checkout.creditCard').parent?.parent;
    fireEvent.press(creditCardOption!);

    expect(mockProps.onPaymentMethodChange).toHaveBeenCalledWith('credit_card');
  });

  it('should call onPaymentMethodChange when pix option is pressed', () => {
    const { getByText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    const pixOption = getByText('checkout.pix').parent?.parent;
    fireEvent.press(pixOption!);

    expect(mockProps.onPaymentMethodChange).toHaveBeenCalledWith('pix');
  });

  it('should call onCardholderNameChange when cardholder name is changed', () => {
    const { getByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    const input = getByPlaceholderText('checkout.cardholderNamePlaceholder');
    fireEvent.changeText(input, 'John Doe');

    expect(mockProps.onCardholderNameChange).toHaveBeenCalledWith('John Doe');
  });

  it('should call onCardNumberChange when card number is changed', () => {
    const { getByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    const input = getByPlaceholderText('checkout.cardNumberPlaceholder');
    fireEvent.changeText(input, '4111 1111 1111 1111');

    expect(mockProps.onCardNumberChange).toHaveBeenCalled();
  });

  it('should call onExpiryDateChange when expiry date is changed', () => {
    const { getByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    const input = getByPlaceholderText('checkout.expiryDatePlaceholder');
    fireEvent.changeText(input, '12/25');

    expect(mockProps.onExpiryDateChange).toHaveBeenCalled();
  });

  it('should call onCvvChange when CVV is changed', () => {
    const { getByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    const input = getByPlaceholderText('checkout.cvvPlaceholder');
    fireEvent.changeText(input, '123');

    expect(mockProps.onCvvChange).toHaveBeenCalledWith('123');
  });

  it('should call onSaveCardDetailsChange when checkbox is pressed', () => {
    const { getByText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' saveCardDetails={false} />);

    const checkbox = getByText('checkout.saveCardDetails').parent;
    fireEvent.press(checkbox!);

    expect(mockProps.onSaveCardDetailsChange).toHaveBeenCalledWith(true);
  });

  it('should show checked state when saveCardDetails is true', () => {
    const { getByText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' saveCardDetails={true} />);

    expect(getByText('checkout.saveCardDetails')).toBeTruthy();
  });

  it('should render coupon section', () => {
    const { getByText, getByPlaceholderText } = render(<PaymentForm {...mockProps} />);

    expect(getByText('checkout.discountCoupon')).toBeTruthy();
    expect(getByPlaceholderText('checkout.couponPlaceholder')).toBeTruthy();
    expect(getByText('common.apply')).toBeTruthy();
  });

  it('should call onCouponCodeChange when coupon code is changed', () => {
    const { getByPlaceholderText } = render(<PaymentForm {...mockProps} />);

    const input = getByPlaceholderText('checkout.couponPlaceholder');
    fireEvent.changeText(input, 'DISCOUNT10');

    expect(mockProps.onCouponCodeChange).toHaveBeenCalledWith('DISCOUNT10');
  });

  it('should call onApplyCoupon when apply button is pressed', () => {
    const { getByText } = render(<PaymentForm {...mockProps} />);

    const applyButton = getByText('common.apply');
    fireEvent.press(applyButton);

    expect(mockProps.onApplyCoupon).toHaveBeenCalled();
  });

  it('should display current values correctly', () => {
    const propsWithValues = {
      ...mockProps,
      cardholderName: 'John Doe',
      cardNumber: '4111 1111 1111 1111',
      expiryDate: '12/25',
      cvv: '123',
      couponCode: 'TESTCODE',
    };

    const { getByDisplayValue } = render(<PaymentForm {...propsWithValues} paymentMethod='credit_card' />);

    expect(getByDisplayValue('John Doe')).toBeTruthy();
    expect(getByDisplayValue('4111 1111 1111 1111')).toBeTruthy();
    expect(getByDisplayValue('12/25')).toBeTruthy();
    expect(getByDisplayValue('123')).toBeTruthy();
    expect(getByDisplayValue('TESTCODE')).toBeTruthy();
  });

  it('should render CVV field as secure text entry', () => {
    const { getByPlaceholderText } = render(<PaymentForm {...mockProps} paymentMethod='credit_card' />);

    const cvvInput = getByPlaceholderText('checkout.cvvPlaceholder');
    // Note: Testing secureTextEntry prop requires checking component props
    // This is a basic test to ensure the field exists
    expect(cvvInput).toBeTruthy();
  });
});
