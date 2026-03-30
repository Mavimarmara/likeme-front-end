import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { findFocusedRoute, useNavigationState, type NavigationState } from '@react-navigation/native';
import { FloatingMenu } from '@/components/ui/menu';

export type FloatingMenuItem = {
  id: string;
  icon?: string;
  iconImage?: ImageSourcePropType;
  label: string;
  fullLabel?: string;
  onPress: () => void;
};

type MenuState = {
  items: FloatingMenuItem[];
  selectedId?: string;
} | null;

type ContextValue = {
  setMenu: (items: FloatingMenuItem[], selectedId?: string) => void;
  clearMenu: () => void;
};

const FloatingMenuContext = createContext<ContextValue | null>(null);

const CHAT_STACK_LIST_ROUTE = 'ChatList';

const ROUTES_SHOW_MENU = new Set<string>([
  'Home',
  'Summary',
  'Activities',
  'AvatarProgress',
  'MarkerDetails',
  'Community',
  'Marketplace',
  'CommunityPreview',
  'Profile',
  'ChatList',
]);

const ROUTE_TO_SELECTED_ID: Record<string, string> = {
  Home: 'home',
  Summary: 'home',
  Activities: 'activities',
  AvatarProgress: 'home',
  MarkerDetails: 'activities',
  Community: 'community',
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

function getChatStackActiveRouteName(state: NavigationState | undefined): string | undefined {
  if (!state?.routes?.length) return undefined;
  const rootIdx = typeof state.index === 'number' ? state.index : 0;
  const rootRoute = state.routes[rootIdx];
  if (rootRoute?.name !== 'Chat') return undefined;

  if (!rootRoute.state) {
    return CHAT_STACK_LIST_ROUTE;
  }

  return getActiveChildRouteName(rootRoute.state as NavigationState) ?? CHAT_STACK_LIST_ROUTE;
}

function getFocusedRouteNameFromNavState(state: NavigationState | undefined): string | undefined {
  const chatLeaf = getChatStackActiveRouteName(state);
  if (chatLeaf !== undefined) {
    return chatLeaf;
  }
  if (!state) return undefined;
  return findFocusedRoute(state)?.name;
}

function getRootRouteName(state: NavigationState | undefined): string | undefined {
  if (!state?.routes?.length) return undefined;
  const i = typeof state.index === 'number' ? state.index : 0;
  return state.routes[i]?.name;
}

function isMenuAllowedByRouteName(routeName: string | undefined): boolean {
  return routeName == null || ROUTES_SHOW_MENU.has(routeName);
}

function shouldShowMenu(state: NavigationState | undefined): boolean {
  const focusedName = getFocusedRouteNameFromNavState(state);
  const rootName = getRootRouteName(state);

  if (rootName === 'Chat') {
    if (focusedName === CHAT_STACK_LIST_ROUTE) return true;
    return false;
  }

  if (rootName && ROUTES_SHOW_MENU.has(rootName) && rootName !== 'Chat') return true;
  return isMenuAllowedByRouteName(focusedName ?? rootName);
}

function getSelectedIdFromRoute(routeName: string | undefined): string | undefined {
  if (!routeName) return undefined;
  return ROUTE_TO_SELECTED_ID[routeName];
}

export const FloatingMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenuState] = useState<MenuState>(null);

  const currentRouteName = useNavigationState((state) => getRootRouteName(state));
  const focusedRouteName = useNavigationState((state) => getFocusedRouteNameFromNavState(state));
  const showMenuByRoute = useNavigationState((state) => shouldShowMenu(state));
  const selectedIdFromRoute = useMemo(
    () => getSelectedIdFromRoute(focusedRouteName) ?? getSelectedIdFromRoute(currentRouteName),
    [currentRouteName, focusedRouteName],
  );

  const setMenu = useCallback((items: FloatingMenuItem[], selectedId?: string) => {
    setMenuState({ items, selectedId });
  }, []);

  const clearMenu = useCallback(() => {
    setMenuState(null);
  }, []);

  const effectiveSelectedId = selectedIdFromRoute ?? menu?.selectedId;

  const showMenu = menu && showMenuByRoute;

  return (
    <FloatingMenuContext.Provider value={{ setMenu, clearMenu }}>
      {children}
      {showMenu && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 10000, elevation: 10000 }]} pointerEvents='box-none'>
          <FloatingMenu items={menu.items} selectedId={effectiveSelectedId} />
        </View>
      )}
    </FloatingMenuContext.Provider>
  );
};

export const useFloatingMenu = (): ContextValue => {
  const ctx = useContext(FloatingMenuContext);
  if (!ctx) throw new Error('useFloatingMenu must be used within FloatingMenuProvider');
  return ctx;
};

export const useSetFloatingMenu = (items: FloatingMenuItem[], selectedId?: string): void => {
  const { setMenu } = useFloatingMenu();

  React.useEffect(() => {
    setMenu(items, selectedId);
  }, [items, selectedId, setMenu]);
};
