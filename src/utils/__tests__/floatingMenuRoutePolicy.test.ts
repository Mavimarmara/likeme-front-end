import type { NavigationState } from '@react-navigation/native';
import {
  CHAT_STACK_LIST_ROUTE,
  getFocusedRouteNameFromNavState,
  getRootRouteName,
  getSelectedIdFromRoute,
  shouldShowFloatingMenuByRoute,
} from '../floatingMenuRoutePolicy';

/** Monta estado de stack compatível com `findFocusedRoute` nos testes. */
function makeStack(index: number, routeNames: string[]): NavigationState {
  return {
    stale: false,
    type: 'stack',
    index,
    routeNames,
    routes: routeNames.map((name, i) => ({
      name,
      key: `${name}-${i}-key`,
    })),
  } as unknown as NavigationState;
}

function makeChatRoot(nested: NavigationState | undefined): NavigationState {
  return {
    stale: false,
    type: 'stack',
    index: 0,
    routeNames: ['Chat'],
    routes: [
      {
        name: 'Chat',
        key: 'Chat-root-key',
        ...(nested != null ? { state: nested } : {}),
      },
    ],
  } as unknown as NavigationState;
}

function makeNestedRoot(rootName: string, nested: NavigationState): NavigationState {
  return {
    stale: false,
    type: 'stack',
    index: 0,
    routeNames: [rootName],
    routes: [
      {
        name: rootName,
        key: `${rootName}-root-key`,
        state: nested,
      },
    ],
  } as unknown as NavigationState;
}

describe('floatingMenuRoutePolicy', () => {
  describe('Chat stack', () => {
    it('allows menu only on ChatList (nested index 0)', () => {
      const nested = makeStack(0, ['ChatList']);
      const state = makeChatRoot(nested);
      expect(getRootRouteName(state)).toBe('Chat');
      expect(getFocusedRouteNameFromNavState(state)).toBe('ChatList');
      expect(shouldShowFloatingMenuByRoute(state)).toBe(true);
    });

    it('hides menu on conversation screen (inner route name Chat)', () => {
      const nested = makeStack(1, ['ChatList', 'Chat']);
      const state = makeChatRoot(nested);
      expect(getFocusedRouteNameFromNavState(state)).toBe('Chat');
      expect(shouldShowFloatingMenuByRoute(state)).toBe(false);
    });

    it('hides menu on ChatDetails', () => {
      const nested = makeStack(2, ['ChatList', 'Chat', 'ChatDetails']);
      const state = makeChatRoot(nested);
      expect(getFocusedRouteNameFromNavState(state)).toBe('ChatDetails');
      expect(shouldShowFloatingMenuByRoute(state)).toBe(false);
    });

    it('treats missing nested state as ChatList for policy', () => {
      const state = makeChatRoot(undefined);
      expect(getFocusedRouteNameFromNavState(state)).toBe(CHAT_STACK_LIST_ROUTE);
      expect(shouldShowFloatingMenuByRoute(state)).toBe(true);
    });
  });

  describe('telas com menu (rota focada na folha)', () => {
    it.each(['Marketplace', 'Cart', 'ProductDetails', 'Profile', 'Summary'])(
      '%s: stack de um nível permite overlay',
      (screenName) => {
        const state = makeStack(0, [screenName]);
        expect(getRootRouteName(state)).toBe(screenName);
        expect(shouldShowFloatingMenuByRoute(state)).toBe(true);
      },
    );

    it('Marketplace: mantém overlay se a folha focada não estiver na whitelist (ex.: estado aninhado)', () => {
      const nested = makeStack(0, ['SomeNestedLeafNotInWhitelist']);
      const state = makeNestedRoot('Marketplace', nested);
      expect(getFocusedRouteNameFromNavState(state)).toBe('SomeNestedLeafNotInWhitelist');
      expect(shouldShowFloatingMenuByRoute(state)).toBe(true);
    });
  });

  describe('stack Community (raiz Community + rotas internas)', () => {
    it('mostra menu na lista (CommunityList)', () => {
      const nested = makeStack(0, ['CommunityList']);
      const state = makeNestedRoot('Community', nested);
      expect(getFocusedRouteNameFromNavState(state)).toBe('CommunityList');
      expect(shouldShowFloatingMenuByRoute(state)).toBe(true);
    });

    it('esconde menu em PostDetail', () => {
      const nested = makeStack(1, ['CommunityList', 'PostDetail']);
      const state = makeNestedRoot('Community', nested);
      expect(getFocusedRouteNameFromNavState(state)).toBe('PostDetail');
      expect(shouldShowFloatingMenuByRoute(state)).toBe(false);
    });
  });

  describe('telas sem menu por rota', () => {
    it('ProviderProfile não está em ROUTES_SHOW_MENU', () => {
      const state = makeStack(0, ['ProviderProfile']);
      expect(shouldShowFloatingMenuByRoute(state)).toBe(false);
    });

    it('Checkout não está em ROUTES_SHOW_MENU', () => {
      const state = makeStack(0, ['Checkout']);
      expect(shouldShowFloatingMenuByRoute(state)).toBe(false);
    });
  });

  describe('getSelectedIdFromRoute', () => {
    it('mapeia folhas usadas no pill', () => {
      expect(getSelectedIdFromRoute('ChatList')).toBe('chat');
      expect(getSelectedIdFromRoute('CommunityList')).toBe('community');
      expect(getSelectedIdFromRoute('Cart')).toBe('marketplace');
      expect(getSelectedIdFromRoute('Profile')).toBe('profile');
    });
  });
});
