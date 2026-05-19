import { BOTTOM_DOCK_BAR_HEIGHT, BOTTOM_DOCK_SUPPORT_GAP, POST_DETAIL_ROUTE } from '@/constants/bottomDockBar';

const SUPPORT_BUTTON_DEFAULT_BOTTOM_OFFSET = 20;

export function supportFloatingBottomOffset(
  focusedRouteName: string | undefined,
  isFloatingMenuVisible: boolean,
  bottomInset: number,
): number {
  if (focusedRouteName === POST_DETAIL_ROUTE) {
    return BOTTOM_DOCK_BAR_HEIGHT + BOTTOM_DOCK_SUPPORT_GAP;
  }

  if (isFloatingMenuVisible) {
    return BOTTOM_DOCK_BAR_HEIGHT + BOTTOM_DOCK_SUPPORT_GAP;
  }

  return bottomInset + SUPPORT_BUTTON_DEFAULT_BOTTOM_OFFSET;
}
