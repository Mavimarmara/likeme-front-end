const { withXcodeProject } = require('@expo/config-plugins');

/**
 * Desativa destinos "Designed for iPhone/iPad" em Mac e visionOS (build settings da Apple).
 * Independente de `ios.supportsTablet`; não altera suporte a iPad no App Store.
 */
module.exports = function withIosIphoneOnlyDestinations(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    project.addBuildProperty('SUPPORTS_MAC_DESIGNED_FOR_IPHONE_IPAD', 'NO');
    project.addBuildProperty('SUPPORTS_XR_DESIGNED_FOR_IPHONE_IPAD', 'NO');
    project.addBuildProperty('SUPPORTS_MACCATALYST', 'NO');
    return config;
  });
};
