const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(
  __dirname,
  '..',
  'node_modules',
  'react-native',
  'scripts',
  'codegen',
  'templates',
  'RCTThirdPartyComponentsProviderMM.template',
);

const generatorPath = path.resolve(
  __dirname,
  '..',
  'node_modules',
  'react-native',
  'scripts',
  'codegen',
  'generate-artifacts-executor',
  'generateRCTThirdPartyComponents.js',
);

function patchTemplate() {
  if (!fs.existsSync(templatePath)) {
    return;
  }

  const source = fs.readFileSync(templatePath, 'utf8');
  const marker = 'mutableThirdPartyComponents';
  if (source.includes(marker)) {
    return;
  }

  const oldBlock = `    thirdPartyComponents = @{
{thirdPartyComponentsMapping}
    };`;

  const newBlock = `    NSMutableDictionary<NSString *, Class<RCTComponentViewProtocol>> *mutableThirdPartyComponents = [NSMutableDictionary new];
{thirdPartyComponentsMapping}
    thirdPartyComponents = [mutableThirdPartyComponents copy];`;

  if (!source.includes(oldBlock)) {
    return;
  }

  fs.writeFileSync(templatePath, source.replace(oldBlock, newBlock));
}

function patchGenerator() {
  if (!fs.existsSync(generatorPath)) {
    return;
  }

  const source = fs.readFileSync(generatorPath, 'utf8');
  const marker = 'mutableThirdPartyComponents[@"${componentName}"] = klass;';
  if (source.includes(marker)) {
    return;
  }

  const oldLine = '        return `\\t\\t@"${componentName}": NSClassFromString(@"${className}"), // ${library}`;';

  const newLine =
    '        return `\\t\\t{ Class<RCTComponentViewProtocol> klass = NSClassFromString(@"${className}"); if (klass != nil) { mutableThirdPartyComponents[@"${componentName}"] = klass; } } // ${library}`;';

  if (!source.includes(oldLine)) {
    return;
  }

  fs.writeFileSync(generatorPath, source.replace(oldLine, newLine));
}

patchTemplate();
patchGenerator();
