import { StyleSheet, TextStyle } from 'react-native';

export const BLOCK_GAP = 8;
export const LIST_ITEM_GAP = 8;
export const LIST_MARKER_WIDTH = 22;

export const defaultLinkStyle: TextStyle = {
  color: '#2563eb',
  textDecorationLine: 'underline',
};

export const styles = StyleSheet.create({
  container: {
    gap: BLOCK_GAP,
  },
  spacer: {
    height: BLOCK_GAP,
  },
  list: {
    gap: LIST_ITEM_GAP,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  listItemContent: {
    flex: 1,
  },
});

export function buildListMarkerStyle(flatStyle: TextStyle): TextStyle {
  return {
    fontSize: flatStyle.fontSize,
    lineHeight: flatStyle.lineHeight,
    fontFamily: flatStyle.fontFamily,
    color: flatStyle.color,
    width: LIST_MARKER_WIDTH,
    flexShrink: 0,
  };
}
