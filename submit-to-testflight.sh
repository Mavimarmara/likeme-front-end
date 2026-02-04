#!/bin/bash
# Envia o último build iOS para o TestFlight.
# Usa APPLE_ID do .env se existir; senão usa o valor já definido no eas.json.

set -e

cd "$(dirname "$0")"

if [ -f .env ]; then
  echo "📋 Carregando .env..."
  set -a
  source .env
  set +a
  if [ -n "$APPLE_ID" ]; then
    echo "✓ APPLE_ID do .env será usado no submit"
    # Atualiza eas.json com APPLE_ID do .env (EAS Submit usa o valor do eas.json)
    export APPLE_ID
    node -e "
      const fs = require('fs');
      const path = require('path');
      const appleId = process.env.APPLE_ID;
      if (!appleId) process.exit(0);
      const easPath = path.join(process.cwd(), 'eas.json');
      const eas = JSON.parse(fs.readFileSync(easPath, 'utf8'));
      if (eas.submit) {
        if (eas.submit.staging?.ios) eas.submit.staging.ios.appleId = appleId;
        if (eas.submit.production?.ios) eas.submit.production.ios.appleId = appleId;
        fs.writeFileSync(easPath, JSON.stringify(eas, null, 2));
        console.log('[submit-to-testflight] eas.json atualizado com APPLE_ID do .env');
      }
    "
  fi
else
  echo "⚠️  .env não encontrado; usando appleId do eas.json"
fi

echo ""
echo "📤 Enviando último build iOS para TestFlight..."
# Sem --non-interactive para permitir configurar App Store Connect API Key na primeira vez
eas submit --platform ios --latest --profile production

echo ""
echo "✅ Submit concluído. Verifique no App Store Connect → TestFlight."
