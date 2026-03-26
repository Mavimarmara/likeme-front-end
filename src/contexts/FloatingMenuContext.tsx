import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { FloatingMenu } from '@/components/ui/menu';

export type FloatingMenuItem = {
  id: string;
  icon: string;
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

type NavState = {
  routes: Array<{ name: string; state?: NavState }>;
  index: number;
};

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
  'Chat',
]);

const ROUTE_TO_SELECTED_ID: Record<string, string> = {
  Home: 'home',
  Summary: 'home',
  Activities: 'activities',
  AvatarProgress: 'home',
  MarkerDetails: 'activities',
  Community: 'community',
  Chat: 'chat',
  Marketplace: 'marketplace',
  ProductDetails: 'marketplace',
  AffiliateProduct: 'marketplace',
  Cart: 'marketplace',
  Checkout: 'marketplace',
  CommunityPreview: 'marketplace',
  ProviderProfile: 'marketplace',
  Profile: 'profile',
};

function asNavState(state: unknown): NavState | undefined {
  const s = state as Partial<NavState> | undefined;
  if (!s?.routes || !Array.isArray(s.routes)) return undefined;
  if (typeof s.index !== 'number') return undefined;
  if (s.routes.length === 0) return undefined;
  return s as NavState;
}

function getRouteAtIndex(state: NavState | undefined): { name: string; state?: NavState } | undefined {
  if (!state) return undefined;
  return state.routes[state.index];
}

function getFocusedRouteNameFromState(state: NavState | undefined): string | undefined {
  let route = getRouteAtIndex(state);
  while (route?.state) {
    const nextState = asNavState(route.state);
    const nextRoute = getRouteAtIndex(nextState);
    if (!nextRoute) break;
    route = nextRoute;
  }
  return route?.name;
}

function isMenuAllowedByRouteName(routeName: string | undefined): boolean {
  return routeName == null || ROUTES_SHOW_MENU.has(routeName);
}

function shouldShowMenu(state: NavState | undefined): boolean {
  const focusedName = getFocusedRouteNameFromState(state);
  const rootName = getRouteAtIndex(state)?.name;

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

  const currentRouteName = useNavigationState((state) => state?.routes?.[state?.index]?.name);
  const focusedRouteName = useNavigationState((state) => getFocusedRouteNameFromState(asNavState(state)));
  const showMenuByRoute = useNavigationState((state) => shouldShowMenu(asNavState(state)));
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
        <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
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
