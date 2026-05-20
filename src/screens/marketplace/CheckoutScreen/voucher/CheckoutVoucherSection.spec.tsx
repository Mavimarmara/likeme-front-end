import { render, fireEvent } from '@testing-library/react-native';
import CheckoutVoucherSection from './CheckoutVoucherSection';

jest.mock('@/components/ui/buttons', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    PrimaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SecondaryButton: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@/components/ui/inputs/TextInput', () => {
  const React = require('react');
  const { TextInput: RNTextInput, View, Text } = require('react-native');
  return React.forwardRef(
    ({ label, placeholder, value, onChangeText, ...props }: Record<string, unknown>, ref: unknown) => (
      <View>
        {label ? <Text>{label}</Text> : null}
        <RNTextInput
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          testID={placeholder || label}
          {...props}
        />
      </View>
    ),
  );
});

describe('CheckoutVoucherSection', () => {
  const mockProps = {
    couponCode: '',
    onCouponCodeChange: jest.fn(),
    onApplyCoupon: jest.fn(),
    onRemoveCoupon: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza campo e botão aplicar', () => {
    const { getByText, getByPlaceholderText } = render(<CheckoutVoucherSection {...mockProps} />);

    expect(getByText('checkout.discountCoupon')).toBeTruthy();
    expect(getByPlaceholderText('checkout.couponPlaceholder')).toBeTruthy();
    expect(getByText('common.apply')).toBeTruthy();
  });

  it('chama onCouponCodeChange ao digitar', () => {
    const { getByPlaceholderText } = render(<CheckoutVoucherSection {...mockProps} />);

    fireEvent.changeText(getByPlaceholderText('checkout.couponPlaceholder'), 'SAVE10');
    expect(mockProps.onCouponCodeChange).toHaveBeenCalledWith('SAVE10');
  });

  it('chama onApplyCoupon ao pressionar aplicar', () => {
    const { getByText } = render(<CheckoutVoucherSection {...mockProps} couponCode='SAVE10' />);

    fireEvent.press(getByText('common.apply'));
    expect(mockProps.onApplyCoupon).toHaveBeenCalled();
  });

  it('exibe cupom aplicado e ação remover', () => {
    const onRemoveCoupon = jest.fn();
    const { getByText } = render(
      <CheckoutVoucherSection {...mockProps} appliedCouponCode='SAVE10' onRemoveCoupon={onRemoveCoupon} />,
    );

    expect(getByText('checkout.couponApplied')).toBeTruthy();
    expect(getByText('checkout.removeCoupon')).toBeTruthy();

    fireEvent.press(getByText('checkout.removeCoupon'));
    expect(onRemoveCoupon).toHaveBeenCalled();
  });
});
