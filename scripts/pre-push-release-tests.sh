#!/bin/sh
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

case "$branch" in
  release/*)
    echo "🧪 [${branch}] Rodando npm test (informativo; push não bloqueia)..."
    test_exit=0
    npm test -- --no-coverage --watchAll=false --forceExit || test_exit=$?
    if [ "$test_exit" -ne 0 ]; then
      echo "⚠️  Testes falharam — push continua. Corrija antes do merge/deploy."
    else
      echo "✅ Testes OK."
    fi
    ;;
esac
