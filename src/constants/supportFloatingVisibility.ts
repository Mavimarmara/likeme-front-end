export const SUPPORT_FLOATING_HIDDEN_ROOT_ROUTES = ['Loading', 'AppLoading'] as const;

export function isRouteNameHiddenForSupportFloating(routeName: string | undefined): boolean {
  if (routeName == null || routeName.length === 0) {
    return false;
  }
  return (SUPPORT_FLOATING_HIDDEN_ROOT_ROUTES as readonly string[]).includes(routeName);
}
