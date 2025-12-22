import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

const COLORS = {
  TEXT_DARK: '#001137',
  BLACK: '#000000',
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.MD,
  },
  modalContainer: {
    backgroundColor: 'rgba(251, 247, 229, 0.96)',
    borderRadius: BORDER_RADIUS.XL,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.MD,
  },
  headerSpacer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
});

