import React from 'react';
import { render } from '@testing-library/react-native';
import WellnessScreen from './index';

describe('WellnessScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WellnessScreen />);
    
    expect(getByText('Bem-estar')).toBeTruthy();
    expect(getByText('Acompanhe sua jornada de saúde')).toBeTruthy();
  });

  it('displays metrics card', () => {
    const { getByText } = render(<WellnessScreen />);
    
    expect(getByText('Métricas de Hoje')).toBeTruthy();
    expect(getByText('Peso: 70kg')).toBeTruthy();
  });

  it('displays activities card', () => {
    const { getByText } = render(<WellnessScreen />);
    
    expect(getByText('Atividades Recentes')).toBeTruthy();
    expect(getByText('Caminhada matinal - 30min')).toBeTruthy();
  });

  it('displays goals card', () => {
    const { getByText } = render(<WellnessScreen />);
    
    expect(getByText('Objetivos')).toBeTruthy();
    expect(getByText('Meta de peso: 68kg')).toBeTruthy();
  });
});
