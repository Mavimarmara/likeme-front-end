const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Plugin que adiciona `use_modular_headers!` ao Podfile.
 * Necessário para Firebase/GoogleUtilities quando Swift pods são integrados como static libraries.
 * @see https://github.com/firebase/firebase-ios-sdk/issues/6479
 */
function withPodfileModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      if (contents.includes('use_modular_headers!')) {
        return config;
      }

      // Inserir use_modular_headers! após a linha "platform :ios" (Expo Podfile)
      const platformMatch = contents.match(/(\s*platform\s+:ios[^\n]*\n)/);
      if (platformMatch) {
        const insertAfter = platformMatch[0];
        const indent = insertAfter.match(/^(\s*)/)[1] || '  ';
        contents = contents.replace(
          insertAfter,
          insertAfter + indent + "use_modular_headers!\n"
        );
      } else {
        // Fallback: inserir após require (início do arquivo)
        const requireMatch = contents.match(/(require\s+['\"][^'\"]+['\"]\s*\n)/);
        if (requireMatch) {
          contents = contents.replace(
            requireMatch[0],
            requireMatch[0] + "\nuse_modular_headers!\n"
          );
        } else {
          contents = 'use_modular_headers!\n\n' + contents;
        }
      }

      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
}

module.exports = withPodfileModularHeaders;
