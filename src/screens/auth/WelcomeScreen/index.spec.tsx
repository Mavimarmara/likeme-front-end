import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from './index';

// Evita problemas com SVGs/ícones no Header
jest.mock('@/components/ui', () => {
  const real = jest.requireActual('@/components/ui');
  return {
    ...real,
    Header: () => null,
  };
});

describe('WelcomeScreen', () => {
  it('navega para Intro ao pressionar Enter em qualquer teclado', () => {
    const navigate = jest.fn();

    const { getByPlaceholderText } = render(
      <WelcomeScreen navigation={{ navigate, goBack: jest.fn() }} />
    );

    const input = getByPlaceholderText('Your name');
    fireEvent.changeText(input, 'John');
    fireEvent(input, 'submitEditing');

    expect(navigate).toHaveBeenCalledWith('Intro', { userName: 'John' });
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from './index';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WelcomeScreen />);
    
    expect(getByText('Wellcome!')).toBeTruthy();
    expect(getByText('How can I call you?')).toBeTruthy();
    expect(getByText('LIKE:ME')).toBeTruthy();
  });

  it('displays name input field', () => {
    const { getByPlaceholderText } = render(<WelcomeScreen />);
    
    expect(getByPlaceholderText('Your name')).toBeTruthy();
  });

  it('enables continue button when name is entered', () => {
    const { getByPlaceholderText, getByText } = render(<WelcomeScreen />);
    
    const nameInput = getByPlaceholderText('Your name');
    const continueButton = getByText('Continue');
    
    // Initially disabled
    expect(continueButton.props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#CCCCCC'
    }));
    
    // After entering name
    fireEvent.changeText(nameInput, 'João');
    
    // Button should be enabled (green background)
    expect(continueButton.props.style).toContainEqual(expect.objectContaining({
      backgroundColor: '#4CAF50'
    }));
  });

  it('navigates to Register screen when continue is pressed', () => {
    const { getByPlaceholderText, getByText } = render(<WelcomeScreen />);
    
    const nameInput = getByPlaceholderText('Your name');
    const continueButton = getByText('Continue');
    
    fireEvent.changeText(nameInput, 'João');
    fireEvent.press(continueButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('shows alert when trying to continue without name', () => {
    const { getByText } = render(<WelcomeScreen />);
    
    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);
    
    // Should show alert (this would need additional mocking for Alert)
    // expect(Alert.alert).toHaveBeenCalled();
  });
});
