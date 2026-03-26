const { withAndroidManifest } = require('@expo/config-plugins');

const AD_ID_PERMISSION = 'com.google.android.gms.permission.AD_ID';

function ensureUsesPermission(manifest, permission) {
  manifest['uses-permission'] ??= [];
  const usesPermissions = manifest['uses-permission'];

  const alreadyAdded = usesPermissions.some((p) => p?.$?.['android:name'] === permission);
  if (!alreadyAdded) {
    usesPermissions.push({ $: { 'android:name': permission } });
  }
}

module.exports = function withAdIdPermission(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;
    ensureUsesPermission(manifest, AD_ID_PERMISSION);
    return config;
  });
};
