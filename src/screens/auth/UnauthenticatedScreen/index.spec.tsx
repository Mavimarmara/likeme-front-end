import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UnauthenticatedScreen from './index';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

// Mock SVG components
jest.mock('@/assets', () => ({
  Logo: 'Logo',
}));

describe('UnauthenticatedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    expect(getByText('LIKE YOUR LIFE')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('handles next button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });

  it('handles login button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);
    
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });
});
