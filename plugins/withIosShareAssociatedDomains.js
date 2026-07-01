const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Garante Associated Domains no LikeMe.entitlements após prebuild (Universal Links / APP-332).
 * Lê ios.entitlements do app.config.js — não duplica host aqui.
 */
module.exports = function withIosShareAssociatedDomains(config) {
  const associatedDomains = config.ios?.entitlements?.['com.apple.developer.associated-domains'];

  return withEntitlementsPlist(config, (modConfig) => {
    if (Array.isArray(associatedDomains) && associatedDomains.length > 0) {
      modConfig.modResults['com.apple.developer.associated-domains'] = associatedDomains;
    }
    return modConfig;
  });
};
