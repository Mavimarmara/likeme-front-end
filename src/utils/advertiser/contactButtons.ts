import type { SvgProps } from 'react-native-svg';
import type { Contact, ContactType } from '@/types/contact';
import { InstagramIcon, MailIcon, PinMapIcon, WebsiteIcon, WhatsappIcon } from '@/assets/ui';
import { resolveAdvertiserContactUrl } from '@/utils/advertiser/contactUrl';

export type AdvertiserContactButton = {
  contact: Contact;
  IconComponent?: React.FC<SvgProps>;
  materialIcon?: string;
  size: number;
  url: string;
};

const CONTACT_TYPE_ORDER: ContactType[] = [
  'instagram',
  'whatsapp',
  'email',
  'website',
  'address',
  'billing_address',
  'phone',
];

const CONTACT_ICON_BY_TYPE: Partial<
  Record<ContactType, { IconComponent?: React.FC<SvgProps>; materialIcon?: string; size: number }>
> = {
  instagram: { IconComponent: InstagramIcon, size: 17 },
  whatsapp: { IconComponent: WhatsappIcon, size: 18 },
  email: { IconComponent: MailIcon, size: 24 },
  website: { IconComponent: WebsiteIcon, size: 24 },
  address: { IconComponent: PinMapIcon, size: 24 },
  ['billing_address']: { IconComponent: PinMapIcon, size: 24 },
  phone: { materialIcon: 'phone', size: 20 },
};

export const buildAdvertiserContactButtons = (contacts: Contact[] | undefined): AdvertiserContactButton[] => {
  const orderIndex = new Map(CONTACT_TYPE_ORDER.map((type, index) => [type, index]));
  return [...(contacts ?? [])]
    .sort((a, b) => (orderIndex.get(a.type) ?? 99) - (orderIndex.get(b.type) ?? 99))
    .map((contact) => {
      const icon = CONTACT_ICON_BY_TYPE[contact.type];
      const url = resolveAdvertiserContactUrl(contact);
      if (!icon || !url) return null;
      return { contact, url, ...icon };
    })
    .filter((contactButton): contactButton is AdvertiserContactButton => contactButton != null);
};
