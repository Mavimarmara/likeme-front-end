import React, { useCallback, useMemo } from 'react';
import { View, Linking, type ViewStyle } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import type { Contact } from '@/types/contact';
import { buildAdvertiserContactButtons, type AdvertiserContactButton } from '@/utils/advertiser/contactButtons';
import { resolveWaMePrefillFromI18n } from '@/utils/marketplace/resolveWaMePrefillFromI18n';
import { logger } from '@/utils/logger';
import { styles } from './styles';

type AdvertiserContactButtonsRowProps = {
  contacts: Contact[] | undefined;
  providerId?: string;
  testID?: string;
  containerStyle?: ViewStyle;
};

export function AdvertiserContactButtonsRow({
  contacts,
  providerId,
  testID,
  containerStyle,
}: AdvertiserContactButtonsRowProps) {
  const contactButtons = useMemo(
    () =>
      buildAdvertiserContactButtons(contacts, {
        waMePrefillText: providerId ? resolveWaMePrefillFromI18n(providerId) : undefined,
      }),
    [contacts, providerId],
  );

  const onContactPress = useCallback(
    (contactButton: AdvertiserContactButton) => {
      Linking.openURL(contactButton.url).catch((error: Error) => {
        logger.error('[AdvertiserContactButtonsRow] Erro ao abrir contato do provider', {
          providerId,
          contactType: contactButton.contact.type,
          cause: error,
        });
      });
    },
    [providerId],
  );

  if (contactButtons.length === 0) {
    return null;
  }

  return (
    <View style={[styles.contactButtonsRow, containerStyle]} testID={testID}>
      {contactButtons.map((contactButton, index) => {
        const ContactIcon = contactButton.IconComponent;
        const contactTestId = `${testID ?? 'advertiser-contact'}-${contactButton.contact.type}`;
        return (
          <View key={`${contactButton.contact.type}-${contactButton.contact.value}-${index}`} testID={contactTestId}>
            <IconButton
              onPress={() => onContactPress(contactButton)}
              {...(ContactIcon
                ? { iconElement: <ContactIcon width={contactButton.size} height={contactButton.size} /> }
                : { icon: contactButton.materialIcon ?? 'link', iconSize: contactButton.size })}
              variant='dark'
              backgroundSize='medium'
              containerStyle={styles.contactIconButtonContainer}
            />
          </View>
        );
      })}
    </View>
  );
}
