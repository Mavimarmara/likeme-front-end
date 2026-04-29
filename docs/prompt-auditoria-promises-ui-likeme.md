# Prompt de auditoria — Promises e risco de UI congelada (LikeMe / `likeme-front-end`)

Você está analisando o app **LikeMe** (`likeme-front-end`). O objetivo é encontrar **Promises/async-await** que possam gerar **sensação de travamento**, **splash ou loading infinito**, **navegação bloqueada** ou **estado de UI inconsistente** (botão desabilitado, spinner eterno, tela de auth presa).

## Escopo sugerido (prioridade)

- `src/services/infrastructure/apiClient.ts` (incluindo `requestWithRefresh`, `refreshBackendToken`, `getHeaders` → leitura de token via storage)
- `src/services/auth/` (`authService`, `storageService`, fluxos Auth0 / `fetchWithTimeout` se existir)
- `src/screens/auth/LoadingScreen/` e demais telas de **bootstrap** (decisão de rota após token / perfil / i18n)
- `src/hooks/` (ex.: feature flags, sessão)
- Qualquer `useEffect` que dispare IIFE `async` ou cadeias longas de `await`

**Arquitetura esperada:** lógica de integração em `services/`, UI em `screens/<domínio>/<Feature>/`, hooks reutilizáveis em `hooks/`. Sinalize quando **telas** acumularem async demais em vez de delegar a serviços.

**Stack de referência:** React Native, React 19, Expo, React Navigation, `fetch` via `apiClient`, Auth0, Firebase Remote Config, Async Storage, imports com alias `@/`.

---

## 1. Rede e autenticação (`apiClient` + refresh)

- Chamadas `fetch` **sem timeout explícito** no `apiClient` vs outros pontos que usam `fetchWithTimeout`: risco de **await pendurado** em rede ruim → UI esperando resposta que nunca chega.
- `requestWithRefresh`: impacto de **sempre** chamar `refreshBackendToken` antes de requests autenticados (latência acumulada, fila de requests, sensação de app “parado” no cold start).
- Caminho **401 → refresh → retry**: possibilidade de **loop** ou **dupla execução** se o backend ou o token estiverem inconsistentes; efeito na UI (logout tardio, loading infinito).
- `handleResponse` + `response.json()`: erros ou corpos grandes que travam o parse; tratamento de erro que **não propaga** contexto suficiente para a tela recuperar o estado.

---

## 2. Storage e headers assíncronos

- `getHeaders` aguarda `storageService.getToken()`: em burst de requests, **contenção** ou I/O lento no Async Storage → atraso global nas telas que dependem da API.
- Ordens de `await` onde **UI já mostrou sucesso** mas persistência falhou (ou o contrário).

---

## 3. Fluxo de entrada (Loading / splash / navegação)

- `LoadingScreen` e equivalentes: combinação de **animações** (`Animated` envolvido em `new Promise`) + **async** (token, validação, remote config). Verificar:
  - `finally` / flags que **sempre** liberam navegação ou fallback
  - `Promise.all` onde uma rejeição **cancela** o conjunto e deixa o fluxo sem rota definida
  - ausência de **cancelamento** se o usuário sair da tela antes do fim da sequência

---

## 4. Firebase Remote Config / Auth0 / Expo

- Inicialização que **bloqueia** a primeira pintura ou o roteamento sem timeout ou sem estado de erro visível.
- Callbacks de SDK que misturam **sync + async** e atualização de estado React.

---

## 5. `useEffect` e efeitos colaterais

- `useEffect` usado para “estado derivado” que poderia ser calculado no render → re-execuções e **rajadas de async**.
- Dependências incorretas → **loops** de fetch ou re-subscribe.
- Falta de **cleanup** (ignore flag, `AbortController` se aplicável ao `fetch` usado) → `setState` após unmount ou resposta antiga sobrescrevendo estado novo (**race**).

---

## 6. Concorrência e agregação

- `Promise.all` vs `Promise.allSettled` em fluxos onde a UI deveria **degradar parcialmente** em vez de falhar tudo.
- `Promise.race` para timeout: garantir que **rejeições** não sejam tratadas como “sucesso” nem deixem Promises sem `catch`.

---

## 7. Promises manuais e animações

- `new Promise((resolve) => Animated...)` sem caminho de `reject` ou sem timeout se a animação for interrompida (navegação, unmount) → **await eterno**.

---

## 8. Tratamento de erros

- `catch` vazio ou log sem **atualizar estado da UI** / sem propagar → loading infinito.
- i18n carregado do backend: falha que deixa labels ou fluxo **pendurado**.

---

## Formato da resposta

1. **Crítico / Alto / Médio** com referência a **arquivo e função** (ex.: `src/services/infrastructure/apiClient.ts` → `requestWithRefresh`).
2. **Sintoma na UI** (ex.: “fica na splash”, “spinner na home”, “botão Voltar não responde”).
3. **Cadeia de await** relevante (resumo).
4. **Correção** alinhada às camadas (`services/` vs `screens/` vs `hooks/`).
5. Se não houver achados: liste **o que foi inspecionado** e por que o risco é baixo nesse trecho.

**Idioma:** português.

**i18n:** textos novos de UI vão para o backend (`i18n_bundle` / API de labels), não JSON estático no app.
