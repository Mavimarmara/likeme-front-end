import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  wrapperReceived: {
    alignItems: 'flex-start',
  },
  wrapperSent: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 20,
    paddingVertical: 17,
  },
  bubbleReceived: {
    backgroundColor: '#F0EEE1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 32,
  },
  bubbleSent: {
    backgroundColor: COLORS.PRIMARY.PURE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  textReceived: {
    color: COLORS.NEUTRAL.LOW.DARK,
  },
  textSent: {
    color: COLORS.WHITE,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.DARK,
    lineHeight: 20,
    marginTop: 2,
  },
  timestampReceived: {
    marginLeft: 4,
  },
  timestampSent: {
    marginRight: 4,
  },
});
