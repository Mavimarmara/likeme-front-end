import { COLORS } from '@/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  main: {
    flex: 1,
    width: 362,
    alignSelf: 'center',
    paddingTop: 60,
    justifyContent: 'space-between',
  },

  content: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
    position: 'relative',
    width: '100%',
  },

  titleAdornment: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.3 }],
    marginBottom: 5,
  },

  inputContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },

  footer: {
    width: '100%',
    paddingBottom: 24,
  },

  primaryButton: {
    width: '100%',
  },
});
