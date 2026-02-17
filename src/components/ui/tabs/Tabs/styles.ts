import { StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
    borderRadius: BORDER_RADIUS.MD,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.SM,
  },

  tabSelected: {
    backgroundColor: COLORS.TEXT,
  },

  tabLabel: {
    color: COLORS.NEUTRAL.LOW.DARK,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '600',
  },

  tabLabelSelected: {
    color: COLORS.WHITE,
  },
});

export type TabsStyles = {
  container?: ViewStyle;
  tab?: ViewStyle;
  tabSelected?: ViewStyle;
  tabLabel?: ViewStyle;
  tabLabelSelected?: ViewStyle;
};
