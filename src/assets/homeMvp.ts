import type { ImageSourcePropType } from 'react-native';

export const HOME_MVP_ASSETS = {
  menu: require('../../assets/home-mvp/menu.png'),
  bell: require('../../assets/home-mvp/bell.png'),
  cart: require('../../assets/home-mvp/cart.png'),
  navActivities: require('../../assets/home-mvp/nav-activities.png'),
  navCommunity: require('../../assets/home-mvp/nav-community.png'),
  navChat: require('../../assets/home-mvp/nav-chat.png'),
  navMarketplace: require('../../assets/home-mvp/nav-marketplace.png'),
  filterChevron: require('../../assets/home-mvp/filter-chevron.png'),
} as const satisfies Record<string, ImageSourcePropType>;
