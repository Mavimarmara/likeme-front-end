const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const target = path.join(projectRoot, 'src', 'constants', 'onboardingDebug.ts');
const template = path.join(projectRoot, 'src', 'constants', 'onboardingDebug.template.ts');

if (fs.existsSync(target)) {
  process.exit(0);
}

if (!fs.existsSync(template)) {
  console.error('[ensure-onboarding-debug] Template em falta:', template);
  process.exit(1);
}

fs.copyFileSync(template, target);
console.log('[ensure-onboarding-debug] Criado', path.relative(projectRoot, target), 'a partir do template.');
