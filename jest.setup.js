// Mock para react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

// Mock para expo-auth-session
jest.mock('expo-auth-session', () => ({
  AuthRequest: jest.fn(),
  ResponseType: {},
  useAuthRequest: jest.fn(),
}));

// Mock para AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock para expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}));

// Mock para expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mock/',
  cacheDirectory: 'file:///mock/cache/',
}));

// Mock global para react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock para @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return jest.fn((props) => React.createElement(View, { testID: 'DateTimePicker', ...props }));
});
