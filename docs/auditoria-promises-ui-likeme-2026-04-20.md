# Auditoria — Promises e risco de UI congelada (LikeMe / `likeme-front-end`)

Execução do prompt: `docs/prompt-auditoria-promises-ui-likeme.md`  
Data: 2026-04-20

---

## 1. Crítico — `apiClient` sem timeout em `fetch`

**Arquivo / função:** `src/services/infrastructure/apiClient.ts` → `get`/`post`/`put`/`patch`/`delete` (via `execute` → `fetch`) e `refreshBackendToken` (linhas 65–71, 145–151, etc.).

**Sintoma na UI:** telas com spinners ou ações que “não respondem” em rede ruim ou DNS lento; cold start após splash pode parecer travado se a primeira API não retorna; possível **await que nunca completa** até o SO encerrar a conexão.

**Cadeia de `await` (resumo):** `getHeaders` → `storageService.getToken()` → `requestWithRefresh` → `refreshBackendToken` (opcional) → `execute()` → **`fetch` sem `AbortController`/timeout** → `handleResponse` → `response.json()`.

**Correção (camadas):** em `services/infrastructure/`, encapsular `fetch` com timeout (reutilizar ou estender `fetchWithTimeout`) e, se fizer sentido, `AbortController` compartilhado por request; alinhar `refreshBackendToken` ao mesmo contrato. Tratar respostas sem corpo JSON (ex.: 204) em `handleResponse` para não quebrar o parse de forma opaca.

---

## 2. Alto — `requestWithRefresh` + refresh **antes** de cada request autenticado

**Arquivo / função:** `apiClient.ts` → `requestWithRefresh` (comentário “paliativo” nas linhas 98–102).

**Sintoma na UI:** app “pesado” após login; listas e telas que disparam várias APIs em paralelo parecem **sequenciais** ou com atraso global; piora com I/O do token (ver item 3).

**Cadeia:** todo `get`/`post`/… com `includeAuth === true` faz **`await this.refreshBackendToken()`** antes do primeiro `fetch`, e em 401 pode repetir refresh + segundo `execute`.

**Correção:** em `services/`: trocar estratégia “sempre refresh” por refresh **sob demanda** (ex.: próximo ao 401, TTL do JWT, ou fila única de refresh deduplicada). Isso reduz latência percebida e pressão no `/api/auth/token` e no Async Storage.

---

## 3. Alto — Headers assíncronos + Async Storage em rajada

**Arquivo / função:** `apiClient.ts` → `getHeaders` + `storageService.getToken()`; qualquer tela/hook que dispare muitas chamadas autenticadas.

**Sintoma na UI:** atraso difuso antes de qualquer dado aparecer; sensação de **lista vazia demorando** sem erro visível.

**Cadeia:** cada request autenticado: `await storageService.getToken()` (potencialmente N vezes em paralelo) + refresh + `fetch`.

**Correção:** em `services/`: cache in-memory do token com invalidação após logout/401/refresh; ou leitura única por “sessão de requests”. Manter persistência no `storageService`, mas evitar N leituras idênticas no mesmo tick.

---

## 4. Médio — Bootstrap na splash: animações + async sem cancelamento ao desmontar

**Arquivo / função:** `src/screens/auth/LoadingScreen/index.tsx` → `run`, helpers `timing` / `fadeTagToStep` / `delay`.

**Sintoma na UI:** em edge cases (navegação forçada, fast refresh), **warnings de `setState` em componente desmontado**; em cenários extremos, animação/interação estranha antes da troca de rota. Há **watchdog** (`BOOTSTRAP_WATCHDOG_*`) que leva à rota `Error` se o fluxo não navegar — mitiga **splash infinita** (~24s no pior caso dos timers).

**Cadeia:** `setTimeout(run)` → vários `await` em `Animated` + `Promise.all` + `storageService` + `fetchWithTimeout` (token) → `ensureI18nHydrated` → `replaceOnce`.

**Correção:** em `screens/auth/LoadingScreen/`: flag `isActive`/`cancelled` no `useEffect` cleanup, checada antes de `setStep` e antes de `replaceOnce`; opcionalmente cancelar timers das animações (API limitada no RN, mas ao menos evitar updates de estado).

**Observação:** o token na splash usa `fetchWithTimeout` com `AUTH_BOOTSTRAP_HTTP_TIMEOUT_MS` (12s) — **bom** e alinhado ao risco de rede; o mesmo não vale para o `apiClient` geral (item 1).

---

## 5. Médio — Hidratação i18n depende do mesmo `apiClient` sem timeout

**Arquivo / função:** `src/i18n/hydration.ts` → `startI18nHydration` → `apiClient.get('/api/i18n/labels', …)`; `ensureI18nHydrated` faz `Promise.race` com timeout que **resolve** após `timeoutMs`.

**Sintoma na UI:** na prática, `LoadingScreen` não fica preso **para sempre** nesse passo (há race de 2,5s), mas o **fetch pode continuar em background** indefinidamente (recursos, bateria) e estados posteriores podem depender de bundle antigo/cache.

**Cadeia:** `ensureI18nHydrated` → `startI18nHydration` → `apiClient.get` (sem timeout no `fetch`).

**Correção:** corrigir timeout no `apiClient` (item 1); opcionalmente endpoint i18n com `fetchWithTimeout` dedicado em `services/` se quiser política diferente da API geral.

---

## 6. Médio — Auth: `fetch` sem timeout em fluxos que afetam UX

**Arquivo / função:** `src/services/auth/authService.ts` → `logout` (`fetch` para `/api/auth/logout`, linhas ~418–427), `acceptPrivacyPolicy` (linhas ~454–461).

**Sintoma na UI:** botão sair ou aceitar política **demorando** ou parecendo sem efeito em rede ruim.

**Correção:** usar `fetchWithTimeout` (ou o cliente HTTP unificado) em `services/auth/`, com tratamento de erro visível na tela que chama.

---

## 7. Baixo — `Promise.race` e tratamento de erros

**Arquivo / função:** `authService.ts` → `withTimeout` (linhas 15–32): ao vencer o timeout, a `promise` original continua em voo — há `clearTimeout` no ramo da promise; OK para não vazar timer.

**`featureFlagService`:** `awaitFetchWithTimeout` chama `void fetchPromise.catch(() => undefined)` após timeout — evita unhandled rejection; `getBooleans` usa `Promise.all` entre flags — se uma `getBoolean` falhasse de forma inesperada, quebraria o conjunto; hoje `getBoolean` captura e retorna default — **risco baixo**.

---

## 8. Baixo — `catch` vazio (não é splash, mas viola padrão de erros)

**Arquivo / função:** `src/screens/avatar/AvatarProgressScreen/index.tsx` → `handleSharePress` (`catch (error) {}`).

**Sintoma na UI:** falha no share **silenciosa** (não é loading infinito).

**Correção:** em `screens/`: log com contexto (`logger`) ou feedback mínimo ao usuário.

---

## 9. O que foi inspecionado e risco baixo

| Trecho | Por que risco baixo aqui |
|--------|-------------------------|
| `src/hooks/featureFlags/useFeatureFlags.ts` | `finally` define `isLoading` false; `isMounted` evita setState após unmount; fallback para defaults em `catch`. |
| `src/services/featureFlags/featureFlagService.ts` | Init não aguarda `fetchAndActivate` indefinidamente; há timeout no refresh explícito e log se init ficar lento. |
| `src/services/auth/authService.ts` (login/validate) | Uso consistente de `withTimeout` / `fetchWithTimeout` nos passos críticos Auth0/backend. |
| `src/services/auth/storageService.ts` | Erros em `getToken` retornam `null` (não trava); contenção é mais de performance que de deadlock. |
| `requestWithRefresh` + 401 | No máximo uma renovação extra e remoção de token; não há loop infinito óbvio no cliente. |

---

## Resumo executivo

O principal risco estrutural de **UI congelada / awaits longos** está no **`apiClient`**: `fetch` e o refresh de token **sem timeout**, somados ao refresh **obrigatório** antes de requests autenticados e à leitura de token no storage por request. O **`LoadingScreen`** já mitiga parte do bootstrap (timeout no token da splash, watchdog, `ensureI18nHydrated` com race), mas animações + estado não cancelados ao desmontar ainda geram risco médio de inconsistência. Ajustes recomendados concentram-se em **`services/infrastructure`** e, em segundo plano, política de refresh + alguns `fetch` soltos em **`authService`**.

**i18n:** conforme regras do projeto, qualquer **texto novo** de erro na UI deve seguir o fluxo via backend (`i18n_bundle` / API de labels).

---

## Referências rápidas

- `src/services/infrastructure/apiClient.ts`
- `src/screens/auth/LoadingScreen/index.tsx`
- `src/i18n/hydration.ts`
- `src/services/auth/authService.ts`
- `src/hooks/featureFlags/useFeatureFlags.ts`
- `src/services/featureFlags/featureFlagService.ts`
