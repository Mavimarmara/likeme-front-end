import React from 'react';
import { render } from '@testing-library/react-native';
import UnauthenticatedScreen from './index';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('UnauthenticatedScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    expect(getByText('LIKE:ME')).toBeTruthy();
    expect(getByText('LIKE YOUR LIFE')).toBeTruthy();
  });

  it('handles next button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    const nextButton = getByText('Next');
    nextButton.props.onPress();
    
    // Add your assertions here
  });

  it('handles login button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    const loginButton = getByText('Login');
    loginButton.props.onPress();
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
