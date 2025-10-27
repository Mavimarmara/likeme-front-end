import React from 'react';
import { render } from '@testing-library/react-native';
import RegisterScreen from './index';

describe('RegisterScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<RegisterScreen />);
    
    expect(getByText('Criar Conta')).toBeTruthy();
    expect(getByText('Preencha os dados abaixo')).toBeTruthy();
  });

  it('displays form fields', () => {
    const { getByText } = render(<RegisterScreen />);
    
    expect(getByText('Nome completo')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Telefone')).toBeTruthy();
    expect(getByText('Senha')).toBeTruthy();
    expect(getByText('Confirmar senha')).toBeTruthy();
  });

  it('shows register button', () => {
    const { getByText } = render(<RegisterScreen />);
    
    expect(getByText('Criar Conta')).toBeTruthy();
  });

  it('shows login link', () => {
    const { getByText } = render(<RegisterScreen />);
    
    expect(getByText('Já tem uma conta? Faça login')).toBeTruthy();
  });
});
