# Prompt de auditoria: exceções globais e logs no lifecycle

## Como usar

Cole a seção **Prompt para o agente** em um chat com o workspace aberto, em checklist de release ou em template de PR. Para **só app móvel**, remova do prompt o bloco **Backend (se aplicável)** e a linha correspondente na introdução.

## Contexto opcional (Likeme)

Pistas para cruzar com o código atual (sempre confirmar no repo):

- [App.tsx](../App.tsx): `LogBox.ignoreAllLogs(true)` e `console.log` de debug em `useEffect` na montagem.
- [ErrorScreen](../src/screens/ErrorScreen/index.tsx): UI de erro via parâmetros de navegação.
- Verificar explicitamente se existem `ErrorBoundary`, `ErrorUtils.setGlobalHandler` ou crash reporting (Sentry etc.).

---

## Prompt para o agente (copiar a partir da próxima linha até o fim do bloco citado)

Você é um revisor técnico sênior. Analise o repositório (frontend mobile React Native/Expo e, se existir, backend Node) e produza um relatório estruturado.

### 1) Tratamento global de exceções e erros não tratados

Verifique e cite arquivos/linhas quando possível:

**React / árvore de componentes**

- Existe `Error Boundary` (classe ou lib) envolvendo a raiz do app ou stacks de navegação? Onde está o fallback UI?
- Erros em render/hooks são capturados ou propagam até crash silencioso?

**React Native**

- Há `ErrorUtils.setGlobalHandler` ou equivalente para JS fatal?
- Tratamento de `Promise` rejeitada não tratada (`unhandledrejection`) em ambiente relevante?
- Integração com crash reporting (ex.: Sentry, Bugsnag, Firebase Crashlytics): inicialização, escopo de release, PII scrubbing?

**Expo**

- Uso de `expo-updates` / recovery após erro de bundle?
- Diferença de comportamento entre `__DEV__` e produção documentada no código?

**Navegação**

- Existe rota/tela genérica de erro (ex.: `ErrorScreen`) e como erros chegam até ela? Cobre erros assíncronos e de render?

**Backend (se aplicável)**

- Middleware global de erro (Express/Fastify/etc.), normalização de resposta, logging com correlação (request id), e não vazamento de stack em produção.

**Critério de conclusão**

- Responda explicitamente: "Existe handler global? Sim/Não/Parcial" com justificativa.
- Liste lacunas (ex.: sem boundary, sem reporting, só UI manual na navegação).

### 2) Logs de debugging no lifecycle das telas

Mapeie padrões como: `useEffect` vazio ou com deps amplas, `useFocusEffect`, listeners de `navigation`, `AppState`, `InteractionManager`, montagem/desmontagem.

Para cada achado relevante:

- Arquivo + trecho (ou descreva o padrão).
- O log roda em produção ou só em `__DEV__`?
- Há risco de vazamento de dados sensíveis (tokens, PII, headers) ou ruído excessivo em produção?
- Impacto em performance (logs em loops, em cada focus, objetos grandes serializados)?

Verifique também configurações globais que afetam observabilidade:

- `LogBox.ignoreAllLogs` / supressão de avisos: justificativa e riscos.

**Critério de conclusão**

- Quantifique: "N telas/arquivos com logs de lifecycle em produção" (estimativa se não for viável contar tudo).
- Separe: útil para diagnóstico vs. lixo de debug esquecido.

### 3) Melhorias priorizadas

Com base apenas no que o código mostra, proponha melhorias em 3 faixas:

**P0 (segurança/estabilidade)** — ex.: sem boundary + sem crash reporting; logs com secrets; erros engolidos.

**P1 (observabilidade)** — ex.: Sentry com tags de rota/usuário anonimizado; boundary por stack; handler global que navega para tela de erro com `reset` seguro.

**P2 (higiene)** — ex.: remover `console.log` de startup em prod; trocar por logger com níveis; `__DEV__` guards; substituir `ignoreAllLogs` por lista fina de ignorados.

Para cada item: ação concreta, arquivo provável a tocar, e trade-off (bundle size, DX, privacidade).

### Formato da resposta

1. Resumo executivo (5–10 linhas)
2. Tabela ou lista: Achado | Severidade | Evidência (path) | Recomendação
3. Perguntas em aberto se algo depender de config externa (CI, secrets, dashboards)

Não implemente mudanças; apenas audite e recomende. Se algo não existir no repo, diga "não encontrado" e sugira o padrão recomendado para RN/Expo.
