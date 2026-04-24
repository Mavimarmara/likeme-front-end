const excludeExpoDevClient = process.env.EXCLUDE_EXPO_DEV_CLIENT === '1';

module.exports = {
  ...(excludeExpoDevClient
    ? {
        dependencies: {
          'expo-dev-client': {
            platforms: {
              android: null,
              ios: null,
            },
          },
        },
      }
    : {}),
};
