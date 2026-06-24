import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import MindAvatarDisabledPng from '../../assets/avatar/DisableMindAvatar.png';
import BodyAvatarDisabledPng from '../../assets/avatar/DisableBodyAvatar.png';
import MindAvatarActivePng from '../../assets/avatar/MindAvatar.png';
import BodyAvatarActivePng from '../../assets/avatar/BodyAvatar.png';
import MenuAccountSettingsIcon from '../../assets/profile/menu-account-settings.svg';
import MenuChevronRightIconSvg from '../../assets/profile/menu-chevron-right.svg';
import MenuDataUsagePolicyIcon from '../../assets/profile/menu-data-usage-policy.svg';
import MenuInterestCategoriesIcon from '../../assets/profile/menu-interest-categories.svg';
import MenuPersonalDataIcon from '../../assets/profile/menu-personal-data.svg';

export const MindAvatar = MindAvatarDisabledPng;
export const BodyAvatar = BodyAvatarDisabledPng;
export const MindAvatarActive = MindAvatarActivePng;
export const BodyAvatarActive = BodyAvatarActivePng;

export const MenuChevronRightIcon = MenuChevronRightIconSvg;

export const PROFILE_HOME_MENU_ICONS = {
  personalData: MenuPersonalDataIcon,
  interestCategories: MenuInterestCategoriesIcon,
  dataUsagePolicy: MenuDataUsagePolicyIcon,
  accountSettings: MenuAccountSettingsIcon,
  chevronRight: MenuChevronRightIconSvg,
} as const satisfies Record<string, FC<SvgProps>>;
