const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const REQUIRED_PODS = [
  "pod 'GoogleUtilities', :modular_headers => true",
  "pod 'FirebaseCoreInternal', :modular_headers => true",
  "pod 'FirebaseABTesting', :modular_headers => true",
  "pod 'FirebaseRemoteConfig', :modular_headers => true",
  "pod 'JWTDecode', :modular_headers => true",
  "pod 'SimpleKeychain', :modular_headers => true",
  "pod 'Auth0', '2.14', :modular_headers => true",
];

const RN_FIREBASE_ANALYTICS_NO_AD_ID = '$RNFirebaseAnalyticsWithoutAdIdSupport = true';

const POST_INSTALL_MARKER = '# likeme-podfile-post-install';

const POST_INSTALL_SNIPPET = `
    ${POST_INSTALL_MARKER}
    deployment_target = podfile_properties['ios.deploymentTarget'] || '15.1'
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        current = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        next if current.nil?

        current_major = current.to_s.split('.').first.to_i
        min_major = deployment_target.to_s.split('.').first.to_i
        if current_major.positive? && current_major < min_major
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = deployment_target
        end
      end
    end

    %w[Auth0 A0Auth0 JWTDecode SimpleKeychain].each do |pod_name|
      target = installer.pods_project.targets.find { |t| t.name == pod_name }
      next unless target

      target.build_configurations.each do |config|
        config.build_settings['DEFINES_MODULE'] = 'YES'
      end
    end
`;

function ensureRnFirebaseAnalyticsWithoutAdIdSupport(contents) {
  if (contents.includes('$RNFirebaseAnalyticsWithoutAdIdSupport')) {
    return contents;
  }
  if (!contents.includes('prepare_react_native_project!')) {
    return contents;
  }
  return contents.replace(
    'prepare_react_native_project!',
    `${RN_FIREBASE_ANALYTICS_NO_AD_ID}\n\nprepare_react_native_project!`,
  );
}

function ensureLikemePostInstall(contents) {
  if (contents.includes(POST_INSTALL_MARKER)) {
    return contents;
  }

  const anchors = [':ccache_enabled => ccache_enabled?(podfile_properties),', ':mac_catalyst_enabled => false,'];

  for (const anchor of anchors) {
    const anchorIdx = contents.indexOf(anchor);
    if (anchorIdx === -1) {
      continue;
    }

    const slice = contents.slice(anchorIdx);
    const closing = slice.match(/\n\s*\)\s*\n/);
    if (!closing) {
      continue;
    }

    const insertPos = anchorIdx + closing.index + closing[0].length;
    return contents.slice(0, insertPos) + POST_INSTALL_SNIPPET + contents.slice(insertPos);
  }

  return contents;
}

function withPodfileModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');
      const original = contents;

      contents = ensureRnFirebaseAnalyticsWithoutAdIdSupport(contents);
      contents = ensureLikemePostInstall(contents);

      const appName = typeof config.name === 'string' ? config.name : 'LikeMe';
      const targetMarker = `target '${appName}' do`;
      if (contents.includes(targetMarker)) {
        const missingPods = REQUIRED_PODS.filter((line) => !contents.includes(line));
        if (missingPods.length > 0) {
          const injectedBlock = `${targetMarker}\n  ${missingPods.join('\n  ')}\n`;
          contents = contents.replace(targetMarker, injectedBlock);
        }
      }

      if (contents !== original) {
        fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);
}

module.exports = withPodfileModularHeaders;
