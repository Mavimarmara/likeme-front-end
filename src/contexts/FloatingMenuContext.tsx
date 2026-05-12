import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { FloatingMenu } from '@/components/ui/menu';
import {
  getFocusedRouteNameFromNavState,
  getRootRouteName,
  getSelectedIdFromRoute,
  shouldShowFloatingMenuByRoute,
} from '@/utils/floatingMenuRoutePolicy';

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
  /** Itens do menu + rota atual permitem exibir o `FloatingMenu` (mesmo critério do overlay). */
  isFloatingMenuVisible: boolean;
};

const noopSetMenu: ContextValue['setMenu'] = () => undefined;
const noopClearMenu: ContextValue['clearMenu'] = () => undefined;

const floatingMenuContextFallback: ContextValue = {
  setMenu: noopSetMenu,
  clearMenu: noopClearMenu,
  isFloatingMenuVisible: false,
};

const FloatingMenuContext = createContext<ContextValue>(floatingMenuContextFallback);

export const FloatingMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenuState] = useState<MenuState>(null);

  const currentRouteName = useNavigationState((state) => getRootRouteName(state));
  const focusedRouteName = useNavigationState((state) => getFocusedRouteNameFromNavState(state));
  const showMenuByRoute = useNavigationState((state) => shouldShowFloatingMenuByRoute(state));
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
  const isFloatingMenuVisible = Boolean(showMenu);

  const contextValue = useMemo(
    () => ({ setMenu, clearMenu, isFloatingMenuVisible }),
    [setMenu, clearMenu, isFloatingMenuVisible],
  );

  return (
    <FloatingMenuContext.Provider value={contextValue}>
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
  return useContext(FloatingMenuContext);
};

export const useIsFloatingMenuVisible = (): boolean => {
  return useContext(FloatingMenuContext).isFloatingMenuVisible;
};

export const useSetFloatingMenu = (items: FloatingMenuItem[], selectedId?: string): void => {
  const { setMenu } = useFloatingMenu();

  React.useEffect(() => {
    setMenu(items, selectedId);
  }, [items, selectedId, setMenu]);
};
