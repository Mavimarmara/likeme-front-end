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

/** Rotas em que o menu flutuante não deve aparecer (root ou nested) */
const ROUTES_HIDE_MENU = ['ProductDetails', 'ProviderProfile', 'Cart', 'Checkout'];

/** No stack Chat, esconder menu nas telas de conversa individual (não na lista) */
const CHAT_STACK_HIDE_MENU_NESTED = ['Chat', 'ChatDetails'];

/** Retorna se o menu deve ser escondido com base no state de navegação */
function shouldHideMenu(state: { routes: { name: string; state?: any }[]; index: number } | undefined): boolean {
  if (!state?.routes?.length || state.index == null) return false;
  const route = state.routes[state.index];
  if (!route) return false;
  if (ROUTES_HIDE_MENU.includes(route.name)) return true;
  if (route.name === 'Chat' && route.state?.routes) {
    const nestedIndex = route.state.index ?? 0;
    const nestedName = route.state.routes[nestedIndex]?.name;
    return CHAT_STACK_HIDE_MENU_NESTED.includes(nestedName);
  }
  return false;
}

/** Mapeia nome da rota (root) para o selectedId do menu */
function getSelectedIdFromRoute(routeName: string | undefined): string | undefined {
  if (!routeName) return undefined;
  const map: Record<string, string> = {
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
  return map[routeName];
}

export const FloatingMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenuState] = useState<MenuState>(null);

  const currentRouteName = useNavigationState((state) => state?.routes?.[state?.index]?.name);
  const hideMenu = useNavigationState(shouldHideMenu);
  const selectedIdFromRoute = useMemo(() => getSelectedIdFromRoute(currentRouteName), [currentRouteName]);

  const setMenu = useCallback((items: FloatingMenuItem[], selectedId?: string) => {
    setMenuState({ items, selectedId });
  }, []);

  const clearMenu = useCallback(() => {
    setMenuState(null);
  }, []);

  const effectiveSelectedId = selectedIdFromRoute ?? menu?.selectedId;

  const showMenu = menu && !hideMenu;

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

/**
 * Define o menu flutuante para a tela atual. O menu fica em overlay e não
 * é afetado pela animação de transição. Ao trocar de tela, a nova tela
 * chama setMenu e substitui o conteúdo (não limpamos no unmount para
 * evitar race ao alternar telas rápido).
 */
export const useSetFloatingMenu = (items: FloatingMenuItem[], selectedId?: string): void => {
  const { setMenu } = useFloatingMenu();

  React.useEffect(() => {
    setMenu(items, selectedId);
  }, [items, selectedId, setMenu]);
};
