const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const REQUIRED_PODS = [
  "pod 'GoogleUtilities', :modular_headers => true",
  "pod 'FirebaseCoreInternal', :modular_headers => true",
  "pod 'FirebaseABTesting', :modular_headers => true",
  "pod 'FirebaseRemoteConfig', :modular_headers => true",
];

function withPodfileModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      const targetMarker = "target 'LikeMe' do";
      if (!contents.includes(targetMarker)) {
        return config;
      }

      const missingPods = REQUIRED_PODS.filter((line) => !contents.includes(line));
      if (missingPods.length === 0) {
        return config;
      }

      const injectedBlock = `${targetMarker}\n  ${missingPods.join('\n  ')}\n`;
      contents = contents.replace(targetMarker, injectedBlock);

      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
}

module.exports = withPodfileModularHeaders;
