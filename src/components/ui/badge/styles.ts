import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(216, 228, 214, 0.72)',
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    paddingHorizontal: 12,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // Note: React Native doesn't support backdrop-filter/blur natively
    // For a blur effect, you would need react-native-blur or similar library
    // This is a close approximation with opacity
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6e6a6a',
    fontStyle: 'normal',
    letterSpacing: 0.2,
    lineHeight: 22,
    textAlign: 'center',
  },
});
