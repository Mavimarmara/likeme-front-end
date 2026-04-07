import { findFocusedRoute, type NavigationState } from '@react-navigation/native';

export const CHAT_STACK_LIST_ROUTE = 'ChatList' as const;

export const ROUTES_SHOW_MENU = new Set<string>([
  'Home',
  'Summary',
  'Activities',
  'AvatarProgress',
  'MarkerDetails',
  'Community',
  'CommunityList',
  'Marketplace',
  'ProductDetails',
  'Cart',
  'CommunityPreview',
  'Profile',
  CHAT_STACK_LIST_ROUTE,
]);

export const ROUTE_TO_SELECTED_ID: Record<string, string> = {
  Home: 'home',
  Summary: 'home',
  Activities: 'activities',
  AvatarProgress: 'home',
  MarkerDetails: 'activities',
  Community: 'community',
  CommunityList: 'community',
  Chat: 'chat',
  ChatList: 'chat',
  Marketplace: 'marketplace',
  ProductDetails: 'marketplace',
  AffiliateProduct: 'marketplace',
  Cart: 'marketplace',
  Checkout: 'marketplace',
  CommunityPreview: 'marketplace',
  ProviderProfile: 'marketplace',
  Profile: 'profile',
};

function getActiveChildRouteName(navState: NavigationState | undefined): string | undefined {
  if (!navState?.routes?.length) return undefined;
  const i = typeof navState.index === 'number' ? navState.index : 0;
  return navState.routes[i]?.name;
}

export function getChatNestedFocusedRouteName(state: NavigationState | undefined): string | undefined {
  if (!state?.routes?.length) return undefined;
  const rootIdx = typeof state.index === 'number' ? state.index : 0;
  const rootRoute = state.routes[rootIdx];
  if (rootRoute?.name !== 'Chat') return undefined;

  if (!rootRoute.state) {
    return CHAT_STACK_LIST_ROUTE;
  }

  const nested = rootRoute.state as NavigationState;
  return findFocusedRoute(nested)?.name ?? getActiveChildRouteName(nested) ?? CHAT_STACK_LIST_ROUTE;
}

export function getFocusedRouteNameFromNavState(state: NavigationState | undefined): string | undefined {
  const chatNested = getChatNestedFocusedRouteName(state);
  if (chatNested !== undefined) {
    return chatNested;
  }
  if (!state) return undefined;
  return findFocusedRoute(state)?.name;
}

export function getRootRouteName(state: NavigationState | undefined): string | undefined {
  if (!state?.routes?.length) return undefined;
  const i = typeof state.index === 'number' ? state.index : 0;
  return state.routes[i]?.name;
}

export function isMenuAllowedByRouteName(routeName: string | undefined): boolean {
  return routeName == null || ROUTES_SHOW_MENU.has(routeName);
}

/** Chat → só `ChatList`; Community → folha; outras rotas whitelist pelo topo do stack. */
export function shouldShowFloatingMenuByRoute(state: NavigationState | undefined): boolean {
  const focusedName = getFocusedRouteNameFromNavState(state);
  const rootName = getRootRouteName(state);

  if (rootName === 'Chat') {
    return focusedName === CHAT_STACK_LIST_ROUTE;
  }

  if (rootName === 'Community') {
    return isMenuAllowedByRouteName(focusedName ?? rootName);
  }

  if (rootName != null && ROUTES_SHOW_MENU.has(rootName)) {
    return true;
  }

  return isMenuAllowedByRouteName(focusedName ?? rootName);
}

export function getSelectedIdFromRoute(routeName: string | undefined): string | undefined {
  if (!routeName) return undefined;
  return ROUTE_TO_SELECTED_ID[routeName];
}
