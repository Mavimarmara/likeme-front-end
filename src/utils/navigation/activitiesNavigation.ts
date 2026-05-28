type Navigation = {
  getParent?: () => Navigation | undefined;
  navigate: (screen: string, params?: unknown) => void;
};

export function navigateToActivitiesOrders(navigation: Navigation): void {
  const rootNavigation = navigation.getParent?.() ?? navigation;
  rootNavigation.navigate('Activities', { initialTab: 'history', initialFilter: 'orders' });
}

export function navigateToOrderDetail(navigation: Navigation, orderId: string): void {
  const rootNavigation = navigation.getParent?.() ?? navigation;
  rootNavigation.navigate('OrderDetail', { orderId });
}
