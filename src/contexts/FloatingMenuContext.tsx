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
const ROUTES_HIDE_MENU = [
  // Onboarding / auth flow
  'Loading',
  'Unauthenticated',
  'Authenticated',
  'Welcome',
  'AppPresentation',
  'Register',
  'Plans',
  'Anamnesis',
  'AnamnesisHome',
  'AnamnesisBody',
  'AnamnesisMind',
  'AnamnesisHabits',
  'AnamnesisCompletion',
  'PersonalObjectives',
  'AppLoading',
  'Error',
  'PrivacyPolicies',
  // Detail flows
  'ProductDetails',
  'ProviderProfile',
  'Cart',
  'Checkout',
];

/** Nomes de telas em que o menu deve ficar escondido (rota focada em qualquer nível) */
const FOCUSED_ROUTES_HIDE_MENU = ['Chat', 'ChatDetails'];

/** Rota focada na stack de Chat que deve mostrar o menu (lista de conversas) */
const CHAT_STACK_LIST_ROUTE = 'ChatList';

/** Retorna o nome da rota ativa no fim da árvore (rota "focada") a partir do state dado */
function getFocusedRouteName(
  state: { routes: { name: string; state?: any }[]; index: number } | undefined,
): string | undefined {
  if (!state?.routes?.length || state.index == null) return undefined;
  let route = state.routes[state.index];
  if (!route) return undefined;
  while (route.state?.routes?.length && route.state?.index != null) {
    route = route.state.routes[route.state.index];
  }
  return route?.name;
}

/** Na stack Chat: índice 0 = ChatList, 1 = Chat, 2 = ChatDetails. Retorna -1 se não for a stack Chat. */
function getChatStackFocusedIndex(
  state: { routes: { name: string; state?: any }[]; index: number } | undefined,
): number {
  if (!state?.routes?.length || state.index == null) return -1;
  const route = state.routes[state.index];
  if (route?.name !== 'Chat' || !route?.state?.routes?.length || route.state?.index == null) return -1;
  return route.state.index as number;
}

/** Retorna se o menu deve ser escondido com base no state de navegação */
function shouldHideMenu(state: { routes: { name: string; state?: any }[]; index: number } | undefined): boolean {
  const focusedName = getFocusedRouteName(state);
  const chatStackIndex = getChatStackFocusedIndex(state);

  // Estamos na stack de Chat: índice 0 = ChatList (mostrar menu), 1 = Chat, 2 = ChatDetails (esconder)
  if (chatStackIndex === 0) return false;
  if (chatStackIndex === 1 || chatStackIndex === 2) return true;
  // Primeira vez na stack Chat: state aninhado pode não existir ainda (chatStackIndex -1) -> mostrar menu
  if (chatStackIndex === -1 && state?.routes?.[state?.index ?? -1]?.name === 'Chat') return false;

  if (focusedName === CHAT_STACK_LIST_ROUTE) return false;
  if (focusedName && FOCUSED_ROUTES_HIDE_MENU.includes(focusedName)) return true;
  if (!state?.routes?.length || state.index == null) return false;
  const route = state.routes[state.index];
  if (!route) return false;
  return ROUTES_HIDE_MENU.includes(route.name);
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
