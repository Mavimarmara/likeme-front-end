#!/bin/sh
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

case "$branch" in
  release/*)
    echo "🧪 [${branch}] npm test (obrigatório em branch release)..."
    npm test -- --no-coverage --watchAll=false --forceExit
    if [ $? -ne 0 ]; then
      echo "❌ Push bloqueado: testes falharam."
      exit 1
    fi
    echo "✅ Testes OK."
    ;;
esac
