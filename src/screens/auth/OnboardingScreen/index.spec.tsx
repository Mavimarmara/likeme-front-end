import React from 'react';
import { render } from '@testing-library/react-native';
import OnboardingScreen from './index';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('OnboardingScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    expect(getByText('LIKE:ME')).toBeTruthy();
    expect(getByText('LIKE YOUR LIFE')).toBeTruthy();
  });

  it('handles next button press', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    const nextButton = getByText('Next');
    nextButton.props.onPress();
    
    // Add your assertions here
  });

  it('handles login button press', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    const loginButton = getByText('Login');
    loginButton.props.onPress();
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
