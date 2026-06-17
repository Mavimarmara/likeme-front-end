import React from 'react';
import { Linking } from 'react-native';
import { render, fireEvent, within } from '@testing-library/react-native';
import { AdvertiserContactButtonsRow } from './index';

jest.mock('@/components/ui/buttons', () => {
  const { Pressable, Text } = require('react-native');
  return {
    IconButton: ({ onPress }: { onPress: () => void }) => (
      <Pressable onPress={onPress} testID='icon-button'>
        <Text>icon</Text>
      </Pressable>
    ),
  };
});

jest.mock('@/utils/marketplace/resolveWaMePrefillFromI18n', () => ({
  resolveWaMePrefillFromI18n: () => 'Olá',
}));

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn() },
}));

describe('AdvertiserContactButtonsRow', () => {
  it('não renderiza quando não há contatos válidos', () => {
    const { queryByTestId } = render(
      <AdvertiserContactButtonsRow contacts={[]} providerId='adv-1' testID='contacts-row' />,
    );
    expect(queryByTestId('contacts-row')).toBeNull();
  });

  it('renderiza botões para contatos disponíveis', () => {
    const { getByTestId } = render(
      <AdvertiserContactButtonsRow
        contacts={[
          { type: 'email', value: 'test@example.com' },
          { type: 'whatsapp', value: '5511999999999' },
        ]}
        providerId='adv-1'
        testID='contacts-row'
      />,
    );

    expect(getByTestId('contacts-row')).toBeTruthy();
    expect(getByTestId('contacts-row-email')).toBeTruthy();
    expect(getByTestId('contacts-row-whatsapp')).toBeTruthy();
  });

  it('abre link ao pressionar contato', () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);

    const { getByTestId } = render(
      <AdvertiserContactButtonsRow
        contacts={[{ type: 'email', value: 'test@example.com' }]}
        providerId='adv-1'
        testID='contacts-row'
      />,
    );

    fireEvent.press(within(getByTestId('contacts-row-email')).getByTestId('icon-button'));
    expect(openURL).toHaveBeenCalledWith('mailto:test@example.com');
  });
});
