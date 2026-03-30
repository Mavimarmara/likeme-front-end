import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.MD,
    gap: 2,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF7EE',
    borderRadius: BORDER_RADIUS.ROUND,
    height: 36,
    paddingLeft: SPACING.MD,
    paddingRight: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    padding: 0,
    paddingVertical: 10,
    paddingHorizontal: 0,
    paddingRight: SPACING.XS,
    paddingLeft: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  searchIconButton: {
    marginRight: 0,
  },
  filterButton: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonBackground: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonImage: {
    width: 40,
    height: 36,
    resizeMode: 'cover',
  },
});
